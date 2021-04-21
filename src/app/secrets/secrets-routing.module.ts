import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';

const routes: Routes = [
  { path: '', component: SecretListPage },
  { path: ':id', component: SecretDetailPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretsPageRoutingModule {}
