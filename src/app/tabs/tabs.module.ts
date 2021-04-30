import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SecretAddComponent } from './components/secret-add/secret-add.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: Httpi18nLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [TabsPage, SecretAddComponent],
})
export class TabsPageModule {}
