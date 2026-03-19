import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultGuard } from '../shared/vault/vault.guard';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';

const routes: Routes = [
  { path: '', component: SecretListPage, canActivate: [VaultGuard] },
  { path: ':id', component: SecretDetailPage, canActivate: [VaultGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretsPageRoutingModule {}
