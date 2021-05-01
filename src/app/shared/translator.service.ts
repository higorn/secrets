import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  private language: string;

  constructor(private translate: TranslateService) {
    this.setDefaultLang('en');
  }

  get(key: string): Observable<string> {
    return this.translate.get(key);
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
    const navLang = this.getNavLang();
    this.language = navLang ? navLang : lang;
    this.translate.use(this.language);
  }

  private getNavLang(): string {
    const lang = navigator.language;
    if (lang && lang.startsWith('en')) return 'en';
    if (lang && lang.startsWith('pt')) return 'pt';
    return lang;
  }
}
