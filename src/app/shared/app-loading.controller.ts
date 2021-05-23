import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslatorService } from './translator.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoadingController {

  constructor(
    private loading: LoadingController,
    private translator: TranslatorService,
  ) { }

  async show(messageKey: string): Promise<void> {
    let message = 'Unsealing, please wait.';
    this.translator.get(messageKey).subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 5000,
    });
    return loading.present();
  }

  dismiss(): void {
    this.loading.dismiss().then(() => {}, (err) => console.log(err))
  }
}
