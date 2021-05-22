import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DateUtils } from 'src/app/shared/date-utils';
import { TranslatorService } from 'src/app/shared/translator.service';
import { SecretListMenuComponent } from '../../components/secret-list-menu/secret-list-menu.component';
import { ImportService } from '../../shared/import.service';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';
import { ImportComponent } from './../../components/import/import.component';
import { SelectItemsComponent } from './../../components/select-items/select-items.component';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss'],
})
export class SecretListPage implements OnInit {
  secrets: Observable<Secret[]>;
  isLoading = true;

  constructor(
    private repository: SecretRepository,
    private importService: ImportService,
    private modal: ModalController,
    private popover: PopoverController,
    private loading: LoadingController,
    private translator: TranslatorService,
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.loadSecrets();
  }

  ionViewDidEnter() {
    this.importService.getDataToImport().subscribe(async (data: Secret[]) => {
      if (data && data.length)
        this.import(await this.chooseSecretsToImport(data));
    })
    this.loadSecrets();
  }

  private async chooseSecretsToImport(secrets: Secret[]): Promise<Secret[]> {
    const modal = await this.modal.create({
      component: ImportComponent,
      componentProps: {
        secrets: secrets
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.cancel) return null;
    return data.secrets;
  }

  private async import(secrets: Secret[]): Promise<void> {
    console.log('secrets to import', secrets);
    if (!secrets) return;

    await this.presentLoading('secrets.list.loading-import');
    const sub1 = this.repository.getAll().subscribe((items) => {
      const collection = items.concat(secrets);
      const sub2 = this.repository.saveAll(collection).subscribe(() => {
        this.loading.dismiss().then(() => {}, (err) => console.log(err))
        this.loadSecrets();
        sub2.unsubscribe();
        sub1.unsubscribe();
      });
    });
  }

  loadSecrets() {
    if (!this.isLoading) this.secrets = this.repository.getAll();
  }

  refresh(event: any): void {
    this.repository.refresh().subscribe(() => {
      this.secrets = this.repository.getAll();
      event.target.complete()
    });
  }

  async showMenu(event: any): Promise<void> {
    const popover = await this.popover.create({
      component: SecretListMenuComponent,
      event: event,
      translucent: true
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
    console.log('role', role);
    if (role === 'select') {
      this.secrets.subscribe(async (secrets) => {
        const data = await this.selectItems(secrets);
        if (data && data.action === 'remove')
          this.remove(data.items)
        console.log('selected', data)
      })
    }
  }

  private async selectItems(secrets: Secret[]): Promise<{ action: string, items: Secret[] }> {
    const modal = await this.modal.create({
      component: SelectItemsComponent,
      componentProps: {
        items: secrets
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.cancel) return null;
    return data;
  }

  private async remove(items: Secret[]): Promise<void> {
    console.log('removing...', items);
    await this.presentLoading('secrets.list.loading-remove');
    const sub1 = this.repository.getAll().subscribe((currItems) => {
      const toRemove = currItems.filter(ci => items.some(i => i.id === ci.id));
      console.log('to remove', toRemove)
      toRemove.forEach(i => {
        i.removed = true;
        i.modified = DateUtils.getUtcTime()
      })
      const sub2 = this.repository.saveAll(currItems).subscribe(() => {
        this.loading.dismiss().then(() => {}, (err) => console.log(err))
        this.loadSecrets();
        sub2.unsubscribe();
        sub1.unsubscribe();
      })
    });
  }

  private async presentLoading(messageKey: string): Promise<any> {
    let message = 'Unsealing, please wait.';
    this.translator.get(messageKey).subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 5000,
    });
    return loading.present();
  }

  getIcon(type: string) {
    switch (type) {
      case 'web':
        return 'globe-outline';
      case 'mail':
        return 'mail-outline';
      case 'login':
        return 'key-outline';
      case 'card':
        return 'card-outline';
      case 'bank':
        return 'cash-outline';
      case 'identity':
        return 'id-card-outline';
      case 'pin':
        return 'key';
    }
  }
}
