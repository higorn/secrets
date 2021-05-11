import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CloudSyncService, SyncFile } from 'src/app/shared/cloud-sync/cloud-sync.service';
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
    this.settings.getCloudSync().subscribe(cloudSync => this.provider = cloudSync.provider)
  }

  skip(): void {
    this.settings.setFirstTime(false);
    this.router.navigate(['/tabs/secrets']);
  }

  async select(): Promise<void> {
    await this.presentLoading();
    setTimeout(() => {
      this.cloud = this.cloudSyncServiceProvider.getByName(this.provider)
      if (this.op === 'setup')
        this.cloud.setup().subscribe(
          (file: SyncFile) => this.handleCloudSyncSetupSucess(file),
          (error) => this.handleCloudSyncError(error));
      if (this.op === 'restore')
        this.cloud.restore().subscribe(
          (files: SyncFile[]) => this.handleCloudSyncRestoreSucess(files),
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

  private async handleCloudSyncSetupSucess(file: SyncFile) {
    await this.settings.setFirstTime(false).toPromise();
    this.settings.setCloudSync({ provider: this.provider, file: file });
    this.loading.dismiss().then(() => { }, (err) => console.log(err));
    this.router.navigate(this.op === 'restore' ? ['/start'] : ['/tabs/secrets']);
  }

  handleCloudSyncRestoreSucess(files: SyncFile[]): void {
    // if (files.length === 1) {
      this.handleCloudSyncSetupSucess(files[0]);
      // return;
    // }
  }

  private handleCloudSyncError(error: any) {
    console.log('cloud sync setup error', error);
    this.loading.dismiss().then(() => { }, (err) => console.log(err));
  }
}
