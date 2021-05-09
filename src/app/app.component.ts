import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { VaultService } from './shared/vault/vault.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private plt: Platform,
    private zone: NgZone,
    private vault: VaultService,
    private router: Router,
  ) {
    this.plt.pause.subscribe(() => {
      console.log('paused')
/*       this.zone.run(() => {
        this.vault.seal();
        this.router.navigate(['/start']);
      }); */
    });
  }
}
