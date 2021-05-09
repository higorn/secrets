import { Observable } from 'rxjs';

export abstract class StorageService {

  abstract getItem(key: string): Observable<any>;
  abstract setItem(key: string, value: any): Observable<any>;
  abstract removeItem(key: string): Observable<any>;
  abstract clear(): Observable<void>;
  abstract keys(): Observable<string[]>;
}