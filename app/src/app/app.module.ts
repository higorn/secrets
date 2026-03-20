import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy, AnimationController } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule, provideTranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CloudSyncServiceFatcory } from './shared/cloud-sync/cloud-sync.service.fatcory';
import { CloudSyncServiceProvider } from './shared/cloud-sync/cloud-sync.service.provider';
import { IonicStorageService } from './shared/storage/ionic-storage.service';
import { StorageService } from './shared/storage/storage.service';
const animationCtrl = new AnimationController();

/* export interface TransitionOptions extends NavOptions {
  progressCallback?: ((ani: Animation | undefined) => void);
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
} */

export const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(
    ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'
  );
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates
  // and we don't have a null pointer
  return element;
};

export function pageTransition(_: HTMLElement, opts: any) {
  const DURATION = 300;

  // root animation with common setup for the whole transition
  const rootTransition = animationCtrl.create()
    .duration(opts.duration || DURATION)
    .easing('cubic-bezier(0.3,0,0.66,1)');

  // ensure that the entering page is visible from the start of the transition
  const enteringPage = animationCtrl.create()
    .addElement(getIonPageElement(opts.enteringEl))
    .beforeRemoveClass('ion-page-invisible');

  // create animation for the leaving page
  const leavingPage = animationCtrl.create().addElement(
    getIonPageElement(opts.leavingEl)
  );

  // actual customized animation
  if (opts.direction === 'forward') {
    enteringPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');
    leavingPage.fromTo('opacity', '1', '0.25');
  } else {
    leavingPage.fromTo('transform', 'translateX(0)', 'translateX(100%)');
    enteringPage.fromTo('opacity', '0.25', '1');
  }

  // include animations for both pages into the root animation
  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);
  return rootTransition;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: pageTransition
    }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    IonicStorageModule.forRoot({
      name: 'esecrets.db',
      storeName: '_esecretskv',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: './assets/i18n/', suffix: '.json' },
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: StorageService, useClass: IonicStorageService },
    { provide: CloudSyncServiceProvider, useClass: CloudSyncServiceFatcory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
