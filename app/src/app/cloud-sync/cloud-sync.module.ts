import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CloudSyncPageRoutingModule } from './cloud-sync-routing.module';
import { CloudSyncPage } from './pages/cloud-sync/cloud-sync.page';
import { DataRestoreChooseComponent } from './components/data-restore-choose/data-restore-choose.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudSyncPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [CloudSyncPage, DataRestoreChooseComponent],
})
export class CloudSyncPageModule {}
