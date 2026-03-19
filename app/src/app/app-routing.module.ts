import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then((m) => m.StartPageModule),
  },
  {
    path: 'wellcome',
    loadChildren: () => import('./wellcome/wellcome.module').then((m) => m.WellcomePageModule),
  },
  {
    path: 'password-creation',
    loadChildren: () => import('./password-creation/password-creation.module')
      .then((m) => m.PasswordCreationPageModule),
  },
  {
    path: 'cloud-sync',
    loadChildren: () => import('./cloud-sync/cloud-sync.module').then((m) => m.CloudSyncPageModule),
  },
  { path: '**', redirectTo: '/start' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
