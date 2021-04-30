import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretsPageRoutingModule } from './secrets-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecretsPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: Httpi18nLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [SecretListPage, SecretDetailPage],
})
export class SecretsPageModule {}
