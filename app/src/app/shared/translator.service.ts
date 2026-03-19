import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  private language: string;

  constructor(
    private translate: TranslateService,
    private storage: StorageService
  ) {
    this.setDefaultLang('en');
  }

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string> {
    return this.translate.get(key, interpolateParams);
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    this.language = lang;
  }

  getLang() {
    return this.language;
  }

  private setDefaultLang(lang: string) {
    this.translate.setDefaultLang(lang);
    this.storage.getItem('settings').subscribe((settings) => {
      const navLang = this.getNavLang();
      this.language =
        settings && settings.language
          ? settings.language
          : navLang
          ? navLang
          : lang;
      this.translate.use(this.language);
    });
  }

  private getNavLang(): string {
    const lang = navigator.language;
    if (lang && lang.startsWith('en')) return 'en';
    if (lang && lang.startsWith('pt')) return 'pt';
    return lang;
  }
}
