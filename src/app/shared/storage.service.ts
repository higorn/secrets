import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // constructor(private storage: Storage) {
  constructor() {
    // this.storage.create();
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    // this.storage.set(key, value);
  }

  get(key: string): any {
    let value = JSON.parse(localStorage.getItem(key));
    // value[0]['abc'] = 'cba'
    return value
    // return this.storage.get(key);
  }
}
