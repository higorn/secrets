import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretDetailPage } from './pages/secret-detail/secret-detail.page';
import { SecretListPage } from './pages/secret-list/secret-list.page';
import { SecretNewPage } from './pages/secret-new/secret-new.page';

const routes: Routes = [
  { path: '', component: SecretListPage },
  // { path: 'new', component: SecretNewPage },
  { path: ':id', component: SecretDetailPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretsPageRoutingModule {}
