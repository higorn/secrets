import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CloudSyncService } from 'src/app/shared/cloud-sync/cloud-sync.service';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { TranslatorService } from 'src/app/shared/translator.service';
import { SettingsService } from './../../../shared/settings.service';

@Component({
  selector: 'app-cloud-sync',
  templateUrl: './cloud-sync.page.html',
  styleUrls: ['./cloud-sync.page.scss'],
})
export class CloudSyncPage implements OnInit, OnDestroy {
  provider: string;
  private cloud: CloudSyncService
  private translateSub: Subscription;

  constructor(
    private router: Router,
    private settings: SettingsService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
    private translator: TranslatorService,
    private loading: LoadingController
  ) {}

  ngOnDestroy(): void {
    this.translateSub && this.translateSub.unsubscribe();
  }

  ngOnInit() {
    this.settings.getCloudSync().subscribe(cloudProvider => this.provider = cloudProvider)
  }

  skip(): void {
    this.router.navigate(['/tabs/secrets']);
  }

  async select(): Promise<void> {
    await this.presentLoading();
    setTimeout(() => {
      this.cloud = this.cloudSyncServiceProvider.getByName(this.provider)
      this.cloud.signIn().subscribe((res) => {
        console.log('signIn res', res)
        this.loading.dismiss().then((res) => console.log('dismiss', res), (err) => console.log(err))
        this.router.navigate(['/tabs/secrets']);
      }, (error) => {
        console.log('sign in error', error)
        this.loading.dismiss().then((res) => console.log('dismiss', res), (err) => console.log(err))
      });
    })
  }

  private async presentLoading(): Promise<any> {
    let message = 'Please wait.';
    this.translateSub = this.translator
      .get('cloud-sync.loading')
      .subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 60000,
    });
    return loading.present();
  }
}
