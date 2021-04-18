import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretListPage } from './pages/secret-list/secret-list.page';

const routes: Routes = [
  {
    path: '',
    component: SecretListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretsPageRoutingModule {}
