import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { VaultService } from './shared/vault/vault.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private hidden: string;
  private visibilityChangeEvent: string;

  constructor(
    private zone: NgZone,
    private vault: VaultService,
    private router: Router,
  ) {
    if (this.isVisibilityApiAvailable())
      document.addEventListener(this.visibilityChangeEvent, () => this.handleVisibilityChange(), false)
  }

  private handleVisibilityChange() {
    this.zone.run(() => {
      this.vault.seal();
      this.router.navigate(['/start']);
    });
  }

  private isVisibilityApiAvailable(): boolean {
    if (typeof document.hidden !== "undefined") {
      this.hidden = "hidden";
      this.visibilityChangeEvent = "visibilitychange";
    } else if (typeof document['msHidden'] !== "undefined") {
      this.hidden = "msHidden";
      this.visibilityChangeEvent = "msvisibilitychange";
    } else if (typeof document['webkitHidden'] !== "undefined") {
      this.hidden = "webkitHidden";
      this.visibilityChangeEvent = "webkitvisibilitychange";
    }

    return typeof document.addEventListener !== 'undefined' && this.hidden !== undefined;
  }
}
