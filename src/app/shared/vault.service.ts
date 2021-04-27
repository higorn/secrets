import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { Bytes } from 'node-forge';
import { Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private key1: { salt: Bytes, iv: Bytes };
  private key2: { key: Bytes, iv: Bytes };
  private keypair: forge.pki.rsa.KeyPair;
  private sealed = true;
  private unsealing = false;
  private unsealedCompleteSource = new Subject<void>();
  ready$ = this.unsealedCompleteSource.asObservable();

  constructor(private storage: StorageService) {
  }

  unseal(pass: string): Observable<void> {
    this.unsealing = true;
    this.storage.getItem('vault').subscribe(vault => {
      if (vault)
        this.restoreVault(vault, pass);
      else
        this.createVault(pass);
    })
    return this.ready$;
  }

  isSealed(): boolean {
    return this.sealed;
  }

  isUnsealing(): boolean {
    return this.unsealing;
  }

  private createVault(pass: string): void {
    if (typeof Worker === 'undefined') {
      this.initKeys(forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001}), pass)
      return
    }
    forge.pki.rsa.generateKeyPair({bits: 2048, workers: 2}, (err, kpair) => {
      this.initKeys(kpair, pass);
    });
  }

  private initKeys(kpair: forge.pki.rsa.KeyPair, pass: string) {
    const keys = this.createKeys(kpair)
    const sealedKeys = this.sealKeys(keys, pass)
    this.storage.setItem('vault', sealedKeys);
    this.notify();
  }

  private createKeys(kpair: forge.pki.rsa.KeyPair): { k1: any, kp: any, k2: any } {
    this.key1 = { salt: forge.random.getBytesSync(128), iv: forge.random.getBytesSync(16) }
    this.keypair = kpair;
    const keypair = {
      publicKey: forge.pki.publicKeyToPem(kpair.publicKey),
      privateKey: forge.pki.privateKeyToPem(kpair.privateKey),
    };
    this.key2 = { key: forge.random.getBytesSync(32), iv: forge.random.getBytesSync(32) };
    return { k1: this.key1, kp: keypair, k2: this.key2 };
  }

  private sealKeys(keys: { k1: any, kp: any, k2: any }, pass: string) {
    const sealedKeys = [forge.util.encode64(JSON.stringify({ salt: forge.util.encode64(keys.k1.salt), iv: forge.util.encode64(keys.k1.iv) }))];
    sealedKeys.push(this.encryptKeypair(JSON.stringify(keys.kp), pass));
    sealedKeys.push(forge.util.encode64(this.keypair.publicKey.encrypt(JSON.stringify(keys.k2))));
    return sealedKeys;
  }

  private restoreVault(vault: any, pass: string): void {
    if (typeof Worker === 'undefined') {
      this.unsealKeys(vault, forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001}), pass)
      return
    }
    forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001}, (err, kpair) => {
      this.unsealKeys(vault, kpair, pass);
    });
  }

  private unsealKeys(vault: any, kpair: forge.pki.rsa.KeyPair, pass: string) {
    this.key1 = this.getKey1(vault[0])
    this.keypair = this.getKeyPair(vault[1], kpair, pass);
    this.key2 = this.getKey2(vault[2]);
    this.notify();
  }

  private notify() {
    this.sealed = false;
    this.unsealing = false;
    this.unsealedCompleteSource.next();
  }

  private getKey1(encodedKey: string): { salt: Bytes; iv: Bytes; } {
    const encodedKeyBytes = forge.util.decode64(encodedKey);
    const key1 = JSON.parse(encodedKeyBytes);
    return { salt: forge.util.decode64(key1.salt), iv: forge.util.decode64(key1.iv) };
  }

  private getKeyPair(encodedKeyPair: string, keypair: forge.pki.rsa.KeyPair, pass: string): forge.pki.rsa.KeyPair {
    const decodeKeyPair: { publicKey: string, privateKey: string } = JSON.parse(this.decryptKeypair(encodedKeyPair, pass));
    keypair.publicKey = forge.pki.publicKeyFromPem(decodeKeyPair.publicKey);
    keypair.privateKey = forge.pki.privateKeyFromPem(decodeKeyPair.privateKey);
    return keypair;
  }

  private getKey2(encodedKey: string): { key: Bytes; iv: Bytes; } {
    const encodedKeyBytes = forge.util.decode64(encodedKey);
    const decodedKey = this.keypair.privateKey.decrypt(encodedKeyBytes);
    return JSON.parse(decodedKey);
  }

  private encryptKeypair(data: string, pass: string) {
    const key = forge.pkcs5.pbkdf2(pass, this.key1.salt, 10, 16);

    return this.encrypt(data, key, this.key1.iv);
  }

  private decryptKeypair(encoded: string, pass: string) {
    const key = forge.pkcs5.pbkdf2(pass, this.key1.salt, 10, 16);
    const encodedBytes = forge.util.decode64(encoded);

    return this.decrypt(encodedBytes, key, this.key1.iv);
  }

  encode(data: string) {
    return this.encrypt(data, this.key2.key, this.key2.iv);
  }

  decode(encoded: string) {
    const encodedBytes = forge.util.decode64(encoded);
    return this.decrypt(encodedBytes, this.key2.key, this.key2.iv);
  }

  private encrypt(data: string, key: Bytes, iv: Bytes) {
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encoded = cipher.output;
    return forge.util.encode64(encoded.bytes());
  }

  private decrypt(encodedBytes: string, key: Bytes, iv: Bytes) {
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: iv });
    let decoded = this.execDecrypt(encodedBytes, decipher);
    return decoded;
  }

  private execDecrypt(encodedBytes: string, decipher: forge.cipher.BlockCipher) {
    const len = encodedBytes.length;
    const chnkSize = 1024 * 64;
    let index = 0;
    let decoded = '';
    do {
      decoded += decipher.output.getBytes();
      decipher.update(forge.util.createBuffer(encodedBytes.substr(index, chnkSize)));
      index += chnkSize;
    } while (index < len);
    decipher.finish();
    decoded += decipher.output.getBytes();
    return decoded;
  }
}