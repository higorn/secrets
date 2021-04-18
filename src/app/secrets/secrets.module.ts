import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';

import { SecretsPageRoutingModule } from './secrets-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SecretsPageRoutingModule
  ],
  declarations: [SecretListPage, SecretDetailPage]
})
export class SecretsPageModule {}
