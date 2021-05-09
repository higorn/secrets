import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CloudSyncPage } from './pages/cloud-sync/cloud-sync.page';

const routes: Routes = [
  {
    path: '',
    component: CloudSyncPage,
  },
  {
    path: ':op',
    component: CloudSyncPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloudSyncPageRoutingModule {}
