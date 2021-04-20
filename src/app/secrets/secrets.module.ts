import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SecretFormComponent } from './components/secret-form/secret-form.component';
import { SecretTypesComponent } from './components/secret-types/secret-types.component';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretNewPage } from './pages/secret-new/secret-new.page';
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
    SecretNewPage,
    SecretTypesComponent,
    SecretFormComponent
  ],
})
export class SecretsPageModule {}
