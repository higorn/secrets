import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MasterBtnService } from '../master-btn.service';
import { VaultService } from './vault.service';

@Injectable({
  providedIn: 'root',
})
export class VaultGuard implements CanActivate {
  constructor(
    private router: Router,
    private vault: VaultService,
    private masterBtn: MasterBtnService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    !state.url.match(/\/tabs\/secrets\/[a-z]+/) && this.masterBtn.changeAction('add')
    return this.vault.isSealed() && !this.vault.isUnsealing()
      ? this.router.parseUrl('/start')
      : true;
  }
}
