import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AutofillService } from '../shared/autofill/autofill.service';
import { NativeAutofillService } from '../shared/autofill/native-autofill.service';
import { Httpi18nLoaderFactory } from '../shared/utils';
import { BiometricCredentialsComponent } from './components/biometric-credentials/biometric-credentials.component';
import { SettingsPage } from './pages/settings/settings.page';
import { SettingsPageRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SettingsPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: Httpi18nLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [SettingsPage, BiometricCredentialsComponent],
  providers: [
    { provide: AutofillService, useClass: NativeAutofillService }
  ]
})
export class SettingsPageModule {}
