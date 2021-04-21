import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../shared/storage.service';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretsPageRoutingModule } from './secrets-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecretsPageRoutingModule
  ],
  declarations: [
    SecretListPage,
    SecretDetailPage,
  ],
})
export class SecretsPageModule {}
