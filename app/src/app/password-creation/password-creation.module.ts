import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasswordCreationPageRoutingModule } from './password-creation-routing.module';
import { PasswordCreationPage } from './pages/password-creation/password-creation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordCreationPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [PasswordCreationPage],
})
export class PasswordCreationPageModule {}
