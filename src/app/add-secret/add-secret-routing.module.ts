import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSecretPage } from './pages/add-secret/add-secret.page';

const routes: Routes = [
  {
    path: '',
    component: AddSecretPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSecretPageRoutingModule {}
