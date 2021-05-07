import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { GoogleDriveSyncService } from './../../../shared/google-drive-sync.service';
import { NullCloudSyncService } from './../../../shared/null-cloud-sync.service';
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
    private injector: Injector,
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
      this.cloud = this.getProvider(this.provider)
      this.cloud.signIn().subscribe((res) => {
        console.log('signIn res', res)
        this.loading.dismiss().then((res) => console.log('dismiss', res), (err) => console.log(err))
        this.router.navigate(['/tabs/secrets']);
      });
    })
  }

  private getProvider(provider: string): CloudSyncService {
    switch(provider) {
      case 'google-drive':
        return this.injector.get(GoogleDriveSyncService)
      default:
        return this.injector.get(NullCloudSyncService)
    }
  }

  private async presentLoading(): Promise<any> {
    let message = 'Please wait.';
    this.translateSub = this.translator
      .get('cloud-sync.loading')
      .subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 5000,
    });
    return loading.present();
  }
}
