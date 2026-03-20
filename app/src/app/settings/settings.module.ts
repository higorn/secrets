import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AutofillService } from '../shared/autofill/autofill.service';
import { NativeAutofillService } from '../shared/autofill/native-autofill.service';
import { ImportService } from '../shared/import.service';
import { NativeImportService } from '../shared/native-import.service';
import { BiometricCredentialsComponent } from './components/biometric-credentials/biometric-credentials.component';
import { ImportComponent } from './components/import/import.component';
import { SettingsPage } from './pages/settings/settings.page';
import { SettingsPageRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SettingsPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [SettingsPage, BiometricCredentialsComponent, ImportComponent],
  providers: [
    { provide: AutofillService, useClass: NativeAutofillService },
    { provide: ImportService, useClass: NativeImportService },
  ],
})
export class SettingsPageModule {}
