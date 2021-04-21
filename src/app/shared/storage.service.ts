import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
  // constructor() {
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  set(key: string, value: any) {
    // localStorage.setItem(key, JSON.stringify(value));
    this._storage?.set(key, value);
  }

  get(key: string): any {
    // let value = JSON.parse(localStorage.getItem(key));
    // return value
    return this._storage?.get(key);
  }
}
