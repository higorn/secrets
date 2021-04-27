import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss']
})
export class SecretListPage implements OnInit, OnDestroy {
  secrets: Observable<Secret[]>;
  loading = true;
  private dataReadySubscription: Subscription;

  constructor(
    private repository: SecretRepository,
    private plt: Platform
  ) {
/*     this.plt.ready().then(() => {
      this.repository.dataChanged$.subscribe(() => this.loadSecrets());
    }) */
  }

  ngOnInit(): void {
    this.dataReadySubscription = this.repository.dataReady().subscribe(() => {
      this.loading = false;
      this.loadSecrets()
    });
  }

  ngOnDestroy(): void {
    this.dataReadySubscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.loadSecrets()
  }

  loadSecrets() {
    if (!this.loading)
      this.secrets = this.repository.getAll();
  }

  getIcon(type: string) {
    switch (type) {
      case 'login': return 'log-in-outline'
      case 'card': return 'card-outline'
      case 'id': return 'id-card-outline'
      case 'pin': return 'key'
    }
  }
}
