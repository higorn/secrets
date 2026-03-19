import { WellcomeGuard } from './../shared/wellcome.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartPage } from './pages/start/start.page';

const routes: Routes = [
  {
    path: '',
    component: StartPage,
    canActivate: [WellcomeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartPageRoutingModule {}
