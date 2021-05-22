import { SelectItemsComponent } from './components/select-items/select-items.component';
import { ImportComponent } from './components/import/import.component';
import { NativeImportService } from './shared/native-import.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretsPageRoutingModule } from './secrets-routing.module';
import { ImportService } from './shared/import.service';
import { SecretListMenuComponent } from './components/secret-list-menu/secret-list-menu.component';

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
    ClipboardModule
  ],
  declarations: [
    SecretListPage,
    SecretDetailPage,
    ImportComponent,
    SecretListMenuComponent,
    SelectItemsComponent
  ],
  providers: [
    { provide: ImportService, useClass: NativeImportService }
  ]
})
export class SecretsPageModule {}
