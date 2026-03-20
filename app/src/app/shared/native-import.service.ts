import { map, switchMap } from 'rxjs/operators';
import { DateUtils } from './date-utils';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { ImportService } from './import.service';
import { Secret } from '../secrets/shared/secret';
import { v4 as uuid } from 'uuid';
import { AndroidWebIntent } from 'capacitor-android-webintent';
import { Browser } from '@capacitor/browser';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NativeImportService extends ImportService {
  constructor(private plt: Platform) {
    super();
  }

  isAvailable(): boolean {
    return this.plt.is('capacitor');
  }

  getDataToImport(): Observable<Secret[]> {
    return from(AndroidWebIntent.getLaunchIntent()).pipe(
      switchMap((intent) => {
        console.log('intent', intent);
        if (!intent.extras || intent.extras['android.intent.extra.SUBJECT'] !== 'Chrome Passwords') {
          return of([]);
        }

        const uri = intent.extras['android.intent.extra.STREAM'];
        return from(Filesystem.readFile({ path: uri })).pipe(
          map(({ data }) => {
            const modified = DateUtils.getUtcTime();
            const b64 = typeof data === 'string' ? data : '';
            if (!b64) {
              return [];
            }
            const items = this.csvToObj(atob(b64));
            return items.map(
              (i) =>
                new Secret(uuid(), 'password', i.name || i.url || 'unnamed', {
                  title: i.name || i.url || 'unnamed',
                  username: i.username,
                  password: i.password,
                  site: i.url,
                }, modified, 'chrome', 'credential')
            );
          })
        );
      })
    );
  }

  csvToObj(csv: string): { name: string; url: string; username: string; password: string }[] {
    const items = [];
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(',');
      const obj = {};
      for (let j = 0; j < fields.length; j++) {
        obj[headers[j].trim()] = fields[j].trim();
      }
      items.push(obj);
    }
    return items;
  }

  openBrowser(): Observable<void> {
    return from(Browser.open({ url: 'https://www.google.com' }));
  }
}
