import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Step1Page } from './pages/step1/step1.page';
import { WellcomePage } from './pages/wellcome/wellcome.page';

const routes: Routes = [
  {
    path: '',
    component: WellcomePage,
  },
  {
    path: 'step1',
    component: Step1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellcomePageRoutingModule {}
