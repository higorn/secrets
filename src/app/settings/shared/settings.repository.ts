import { TranslatorService } from 'src/app/shared/translator.service';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/storage.service';
import { Injectable } from '@angular/core';
import { Settings } from './settings';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingsRepository {
  constructor(
    private storage: StorageService,
    private translator: TranslatorService
  ) {}

  save(settings: Settings): Observable<Settings> {
    return this.storage.setItem('settings', settings);
  }

  get(): Observable<Settings> {
    return this.storage.getItem('settings').pipe(
      map((settings) => {
        if (settings) return settings;
        settings = { language: this.translator.getLang() };
        this.storage.setItem('settings', settings);
        return settings;
      })
    );
  }
}
