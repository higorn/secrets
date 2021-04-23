import { Observable } from 'rxjs';

export abstract class StorageService {

  abstract getItem(key: string): Observable<any>;
  abstract setItem(key: string, value: any): void;
  abstract removeItem(key: string): void;
  abstract clear(): void;
}