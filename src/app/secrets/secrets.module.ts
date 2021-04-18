import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretsPage } from './secrets.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SecretsPageRoutingModule } from './secrets-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SecretsPageRoutingModule
  ],
  declarations: [SecretsPage]
})
export class SecretsPageModule {}
