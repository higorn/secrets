import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSecretPage } from './pages/add-secret/add-secret.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AddSecretPageRoutingModule } from './add-secret-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    AddSecretPageRoutingModule
  ],
  declarations: [AddSecretPage]
})
export class AddSecretPageModule {}
