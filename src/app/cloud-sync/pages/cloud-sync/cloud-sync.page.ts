import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudSyncService } from 'src/app/shared/cloud-sync.service';

@Component({
  selector: 'app-cloud-sync',
  templateUrl: './cloud-sync.page.html',
  styleUrls: ['./cloud-sync.page.scss'],
})
export class CloudSyncPage implements OnInit {
  constructor(private router: Router, private cloud: CloudSyncService) {}

  ngOnInit() {}

  skip(): void {
    this.router.navigate(['/tabs/secrets']);
  }

  signIn(): void {
    this.cloud.signIn();
    this.cloud.sync();
  }
}
