import { Observable, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export abstract class StorageService {
  abstract getItem(key: string): Observable<any>;
  abstract setItem(key: string, value: any): Observable<any>;
  abstract removeItem(key: string): Observable<any>;
  abstract clear(): Observable<void>;
  abstract keys(): Observable<string[]>;
  exportData(): Observable<{ [key: string]: string }> {
    return this.keys().pipe(switchMap((keys) => (
      zip(...keys.map((k) => this.getItem(k).pipe(map((val) => ({ k: k, v: val })))))
        .pipe(map((kvList: {k: string, v: string }[]) => {
          const obj = {}
          kvList.forEach((kv) => obj[kv.k] = kv.v)
          return obj
        }))
    )))
  }
  importData(data: any) {
    Object.keys(data).forEach((key) => this.setItem(key, data[key]))
  }

}