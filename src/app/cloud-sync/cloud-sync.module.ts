import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { CloudSyncPageRoutingModule } from './cloud-sync-routing.module';
import { CloudSyncPage } from './pages/cloud-sync/cloud-sync.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudSyncPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: Httpi18nLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [CloudSyncPage],
})
export class CloudSyncPageModule {}
