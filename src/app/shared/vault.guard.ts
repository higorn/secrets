import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VaultService } from './vault.service';

@Injectable({
  providedIn: 'root'
})
export class VaultGuard implements CanActivate {
  constructor(private router: Router, private vault: VaultService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('vault seal', this.vault.isSealed())
    return this.vault.isSealed() ? this.router.parseUrl('/start') : true;
  }
  
}
