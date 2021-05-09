import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultGuard } from '../shared/vault/vault.guard';
import { SettingsPage } from './pages/settings/settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    canActivate: [VaultGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
