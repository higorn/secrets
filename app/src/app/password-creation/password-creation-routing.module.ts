import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordCreationPage } from './pages/password-creation/password-creation.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordCreationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordCreationPageRoutingModule {}
