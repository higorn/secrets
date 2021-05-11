import { CloudSync } from './cloud-sync/cloud-sync.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Settings, DEFAULT_SETTINGS } from './settings';
import { StorageService } from './storage/storage.service';

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

  setFirstTime(isFirstTime: boolean): Observable<void> {
    return this.set('isFirstTime', isFirstTime);
  }

  isFirstTime(): Observable<boolean> {
    return this.get('isFirstTime');
  }

  isBiometricEnabled(): Observable<boolean> {
    return this.get('biometric');
  }

  enableBiometric(): void {
    this.set('biometric', true).subscribe();
  }

  disableBiometric(): void {
    this.set('biometric', false).subscribe();
  }

  getCloudSync(): Observable<CloudSync> {
    return this.get('cloudSync');
  }

  setCloudSync(cloudSync: CloudSync): void {
    this.set('cloudSync', cloudSync).subscribe();
  }

  getDbFileName(): Observable<string> {
    return this.get('dbFileName');
  }

  setDbFileName(fileName: string) {
    this.set('dbFileName', fileName).subscribe();
  }

  private get(key: string): Observable<any> {
    return this.getAll().pipe(
      map((settings) => settings[key]),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  private set(key: string, val: any): Observable<void> {
    return this.getAll().pipe(map((settings) => {
      settings[key] = val;
      this.storage.setItem('settings', settings);
    }));
  }
}
