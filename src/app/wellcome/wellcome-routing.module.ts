import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WellcomePage } from './pages/wellcome/wellcome.page';

const routes: Routes = [
  {
    path: '',
    component: WellcomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellcomePageRoutingModule {}
