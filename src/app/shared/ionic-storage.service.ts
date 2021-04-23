import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class IonicStorageService extends StorageService {

  constructor(private storage: Storage) {
    super();
    this.init();
  }
  private async init() {
    await this.storage.create();
  }

  setItem(key: string, value: any) {
    // localStorage.setItem(key, JSON.stringify(value));
    // this.setItemAsync(key, value);
    this.storage.set(key, value);
  }

  getItem(key: string): Observable<any> {
    // let value = JSON.parse(localStorage.getItem(key));
    // return value
    return from(this.storage.get(key))
  }

  removeItem(key: string): void {
  }

  clear(): void {
  }
}
