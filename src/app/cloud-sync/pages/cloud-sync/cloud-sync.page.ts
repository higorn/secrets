import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  op: string;
  private cloud: CloudSyncService
  private translateSub: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
    private translator: TranslatorService,
    private loading: LoadingController
  ) {}

  ngOnDestroy(): void {
    this.translateSub && this.translateSub.unsubscribe();
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => this.op = params.get('op'));
    this.settings.getCloudSync().subscribe(cloudProvider => this.provider = cloudProvider)
  }

  skip(): void {
    this.settings.setFirstTime(false);
    this.router.navigate(['/tabs/secrets']);
  }

  async select(): Promise<void> {
    await this.presentLoading();
    setTimeout(() => {
      this.cloud = this.cloudSyncServiceProvider.getByName(this.provider)
      this.cloud[this.op]().subscribe(
        (providerId: string) => this.handleCloudSyncSucess(providerId),
        (error) => this.handleCloudSyncError(error));
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

  private async handleCloudSyncSucess(providerId: any) {
    await this.settings.setFirstTime(false).toPromise();
    this.settings.setCloudSync(providerId);
    this.loading.dismiss().then(() => { }, (err) => console.log(err));
    this.router.navigate(this.op === 'restore' ? ['/start'] : ['/tabs/secrets']);
  }

  private handleCloudSyncError(error: any) {
    console.log('cloud sync setup error', error);
    this.loading.dismiss().then(() => { }, (err) => console.log(err));
  }
}
