import { map, switchMap } from 'rxjs/operators';
import { DateUtils } from './../../shared/date-utils';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { ImportService } from './import.service';
import { Secret } from './secret';
import { v4 as uuid } from 'uuid';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class NativeImportService extends ImportService {

  constructor(
    private webIntent: WebIntent
  ) {
    super();
  }

  getDataToImport(): Observable<Secret[]> {
    return from(this.webIntent.getIntent()).pipe(switchMap((intent) => {
      if (!intent.extras || intent.extras['android.intent.extra.SUBJECT'] !== 'Chrome Passwords') return of([]);

      const uri = intent.extras['android.intent.extra.STREAM']
      return from(Filesystem.readFile({ path: uri })).pipe(map(({ data }) => {
        const modified = DateUtils.getUtcTime();
        const items = this.csvToObj(atob(data));
        return items.map((i) => (
            new Secret(uuid(), 'web', i.name || 'unamed', {
              title: i.name || 'unamed',
              user: i.username,
              password: i.password,
              site: i.url
            }, modified, 'chrome')
          )
        )
      }))
    }))
  }

  csvToObj(csv: string): { name: string, url: string, username: string, password: string }[] {
    const items = [];
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      let fields = lines[i].split(',');
      let obj = {};
      for (let j = 0; j < fields.length; j++) {
        obj[headers[j].trim()] = fields[j].trim();
      }
      items.push(obj);
    }
    return items;
  }
}
