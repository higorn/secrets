import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WellcomePageRoutingModule } from './wellcome-routing.module';

import { WellcomePage } from './wellcome.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WellcomePageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: Httpi18nLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [WellcomePage],
})
export class WellcomePageModule {}
