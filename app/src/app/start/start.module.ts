import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { StartPage } from './pages/start/start.page';
import { StartPageRoutingModule } from './start-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [StartPage],
})
export class StartPageModule {}
