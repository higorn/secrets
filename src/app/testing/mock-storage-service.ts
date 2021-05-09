import { from, Observable, of } from "rxjs";
import { StorageService } from "../shared/storage/storage.service";

export class MockStorageService extends StorageService {
  getItem(key: string): Observable<any> {
    return from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(JSON.parse(localStorage.getItem(key))))
    }))
  }
  setItem(key: string, value: any): Observable<any> {
    return from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(localStorage.setItem(key, JSON.stringify(value))))
    }))
  }
  removeItem(key: string): Observable<any> {
    return from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(localStorage.removeItem(key)))
    }))
  }
  clear(): Observable<void> {
    return of(localStorage.clear())
  }
  keys(): Observable<string[]> {
    return of([])
  }
}