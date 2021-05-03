import { TranslatorService } from 'src/app/shared/translator.service';
import { Observable, of } from 'rxjs';
import { StorageService } from 'src/app/shared/storage.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Settings, DEFAULT_SETTINGS } from './settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    private storage: StorageService,
    private translator: TranslatorService
  ) {}

  save(settings: Settings): Observable<Settings> {
    return this.storage.setItem('settings', settings);
  }

  getAll(): Observable<Settings> {
    return this.storage.getItem('settings').pipe(
      map((_settings) => {
        if (_settings) return _settings;
        const settings = DEFAULT_SETTINGS;
        settings.language = this.translator.getLang();
        this.storage.setItem('settings', settings);
        return settings;
      })
    );
  }

  get(key: string): Observable<any> {
    // return this.storage.getItem('settings').pipe(
    return this.getAll().pipe(
      map((settings) => settings[key]),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  set(key: string, val: any): void {
    // this.storage.getItem('settings').subscribe((settings) => {
    this.getAll().subscribe((settings) => {
      settings[key] = val;
      this.storage.setItem('settings', settings);
    });
  }

  isBiometricEnabled(): Observable<boolean> {
    return this.get('biometric');
  }

  enableBiometric(): void {
    this.set('biometric', true);
  }

  disableBiometric(): void {
    this.set('biometric', false);
  }
}
