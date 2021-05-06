import { GoogleDriveSyncService } from './../../../shared/google-drive-sync.service';
import { SettingsService } from './../../../shared/settings.service';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudSyncService } from 'src/app/shared/cloud-sync.service';

@Component({
  selector: 'app-cloud-sync',
  templateUrl: './cloud-sync.page.html',
  styleUrls: ['./cloud-sync.page.scss'],
})
export class CloudSyncPage implements OnInit {
  provider: string;

  constructor(
    private router: Router,
    private cloud: CloudSyncService,
    private settings: SettingsService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.settings.getCloudSync().subscribe(cloudProvider => this.provider = cloudProvider)
  }

  skip(): void {
    this.router.navigate(['/tabs/secrets']);
  }

  select(): void {
    console.log('provider', this.provider);
    this.cloud = this.getProvider(this.provider)
    this.cloud && this.cloud.signIn().subscribe((res) => {
      console.log('signIn res', res)
    });

/*     this.provider === 'google-drive' && this.cloud.signIn().subscribe((res) => {
      console.log('signIn res', res)
    }); */
  }

  getProvider(provider: string): CloudSyncService {
    switch(provider) {
      case 'google-drive':
        return this.injector.get(GoogleDriveSyncService)
      default:
        return null
    }
  }
}
