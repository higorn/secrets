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

  setItem(key: string, value: any): Observable<any> {
    return from(this.storage.set(key, value));
  }

  getItem(key: string): Observable<any> {
    return from(this.storage.get(key))
  }

  removeItem(key: string): Observable<any> {
    return from(this.storage.remove(key))
  }

  clear(): Observable<void> {
    return from(this.storage.clear())
  }

  keys(): Observable<string[]> {
    return from(this.storage.keys());
  }
}
