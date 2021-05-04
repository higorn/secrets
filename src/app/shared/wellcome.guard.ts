import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class WellcomeGuard implements CanActivate {
  constructor(private router: Router, private settings: SettingsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.settings.isFirstTime().pipe(
      map((isFirstTime) => {
        if (isFirstTime) return this.router.parseUrl('/wellcome');
        return true;
      })
    );
  }
}
