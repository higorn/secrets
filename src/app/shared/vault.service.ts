import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { Bytes } from 'node-forge';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private key1: { salt: Bytes, iv: Bytes };
  private key2: { key: Bytes, iv: Bytes };
  private keypair: forge.pki.rsa.KeyPair;
  private sealed = true;

  constructor(private storage: StorageService) {
  }

  unseal(pass: string): void {
    this.storage.getItem('vault').subscribe(vault => {
      if (vault)
        this.restoreVault(vault, pass);
      else
        this.createVault(pass);
    })
  }

  isSealed(): boolean {
    return this.sealed;
  }

  private createVault(pass: string): void {
    this.key1 = { salt: forge.random.getBytesSync(128), iv: forge.random.getBytesSync(16) }
    this.keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
    const keypair = {
      publicKey: forge.pki.publicKeyToPem(this.keypair.publicKey),
      privateKey: forge.pki.privateKeyToPem(this.keypair.privateKey),
    }
    this.key2 = { key: forge.random.getBytesSync(32), iv: forge.random.getBytesSync(32) };
    const vault = [forge.util.encode64(JSON.stringify({ salt: forge.util.encode64(this.key1.salt), iv: forge.util.encode64(this.key1.iv) }))];
    vault.push(this.encryptKeypair(JSON.stringify(keypair), pass));
    vault.push(forge.util.encode64(this.keypair.publicKey.encrypt(JSON.stringify(this.key2))));
    this.storage.setItem('vault', vault);
  }

  private restoreVault(vault: any, pass: string): void {
    this.key1 = this.getKey1(vault[0])
    this.keypair = this.getKeyPair(vault[1], pass);
    this.key2 = this.getKey2(vault[2])
  }
  
  private getKey1(encodedKey: string): { salt: Bytes; iv: Bytes; } {
    const encodedKeyBytes = forge.util.decode64(encodedKey);
    const key1 = JSON.parse(encodedKeyBytes);
    return { salt: forge.util.decode64(key1.salt), iv: forge.util.decode64(key1.iv) };
  }

  private getKeyPair(encodedKeyPair: string, pass: string): forge.pki.rsa.KeyPair {
    const decodeKeyPair: { publicKey: string, privateKey: string } = JSON.parse(this.decryptKeypair(encodedKeyPair, pass));
    const keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
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
