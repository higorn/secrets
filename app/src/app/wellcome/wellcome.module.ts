import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WellcomePage } from './pages/wellcome/wellcome.page';
import { WellcomePageRoutingModule } from './wellcome-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WellcomePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [WellcomePage],
})
export class WellcomePageModule {}
