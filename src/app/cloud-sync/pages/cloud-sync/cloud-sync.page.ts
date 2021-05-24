import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppLoadingController } from 'src/app/shared/app-loading.controller';
import { CloudSyncService, SyncFile } from 'src/app/shared/cloud-sync/cloud-sync.service';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { TranslatorService } from 'src/app/shared/translator.service';
import { CloudSync } from './../../../shared/cloud-sync/cloud-sync.service';
import { SettingsService } from './../../../shared/settings.service';
import { DataRestoreChooseComponent } from './../../components/data-restore-choose/data-restore-choose.component';

@Component({
  selector: 'app-cloud-sync',
  templateUrl: './cloud-sync.page.html',
  styleUrls: ['./cloud-sync.page.scss'],
})
export class CloudSyncPage implements OnInit, OnDestroy {
  provider: string;
  op: string;
  private cloudSync: CloudSync;
  private cloud: CloudSyncService
  private translateSub: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
    private translator: TranslatorService,
    private loading: AppLoadingController,
    private modal: ModalController,
    private alert: AlertController
  ) {}

  ngOnDestroy(): void {
    this.translateSub && this.translateSub.unsubscribe();
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => this.op = params.get('op'));
    this.settings.getCloudSync().subscribe(cloudSync => {
      this.cloudSync = cloudSync;
      this.provider = cloudSync && cloudSync.provider
    })
  }

  skip(): void {
    const sub = this.settings.setFirstTime(false).subscribe(() => {
      sub.unsubscribe();
      console.log('coco')
      this.router.navigate(['/tabs/secrets'])
    });
  }

  async select(): Promise<void> {
    await this.loading.show('cloud-sync.loading', 60000);
    setTimeout(async () => {
      this.cloud = this.cloudSyncServiceProvider.getByName(this.provider)
      const cloudSync = await this.settings.getCloudSync().toPromise();
      const file = this.provider === (cloudSync && cloudSync.provider) ? cloudSync.file : null;
      if (this.op === 'setup')
        this.cloud.setup(file).subscribe(
          (file: SyncFile) => this.handleCloudSyncSetupSucess(file),
          (error) => this.handleCloudSyncError(error));
      if (this.op === 'restore')
        this.cloud.restore().subscribe(
          (files: SyncFile[]) => this.handleCloudSyncRestoreSucess(files),
          (error) => this.handleCloudSyncError(error));
    })
  }

  private async handleCloudSyncSetupSucess(file: SyncFile) {
    await this.settings.setFirstTime(false).toPromise();
    this.settings.setCloudSync({ provider: this.provider, file: file });
    this.loading.dismiss();
    this.router.navigate(this.op === 'restore' ? ['/start'] : ['/tabs/secrets']);
  }

  private async handleCloudSyncRestoreSucess(files: SyncFile[]): Promise<void> {
    if (files.length === 1) {
      this.handleCloudSyncSetupSucess(files[0]);
      return;
    }
    this.loading.dismiss();
    if (files.length === 0) {
      this.handleNoFileToRestore();
      return;
    }

    const file = await this.presentFiles(files)
    if (file) {
      await this.loading.show('cloud-sync.loading', 60000);
      this.cloud.restore(file).subscribe(
        (files: SyncFile[]) => this.handleCloudSyncRestoreSucess(files),
        (error) => this.handleCloudSyncError(error));
    }
  }

  private handleCloudSyncError(error: any) {
    console.log('cloud sync setup error', error);
    this.loading.dismiss();
  }

  private async handleNoFileToRestore() {
    const text = this.getTextForAlert();
    const alert = await this.alert.create({
      header: text.title,
      message: text.message,
      buttons: [
        {
          text: text.ok,
          handler: () => {
            this.router.navigate(['/wellcome']);
          },
        },
      ],
    });
    await alert.present();
  }

  private async presentFiles(files: SyncFile[]): Promise<SyncFile> {
    const modal = await this.modal.create({
      component: DataRestoreChooseComponent,
      componentProps: {
        files: files
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.cancel) return null;
    return data.file;
  }

  private getTextForAlert() {
    let text: any = {};
    this.translator.get('cloud-sync.no-restore-alert.title').subscribe((t) => (text.title = t));
    this.translator.get('cloud-sync.no-restore-alert.message').subscribe((t) => (text.message = t));
    this.translator.get('cloud-sync.no-restore-alert.ok-btn').subscribe((t) => (text.ok = t));
    return text;
  }
}
