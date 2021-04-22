import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class StorageService {
  abstract set(key: string, value: any): any;
  abstract get(key: string): any;
}