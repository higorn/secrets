import { Injectable } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AppLoadingController } from 'src/app/shared/app-loading.controller';
import { DateUtils } from 'src/app/shared/date-utils';
import { SecretListMenuComponent } from '../components/secret-list-menu/secret-list-menu.component';
import { SelectItemsComponent } from '../components/select-items/select-items.component';
import { SecretListPage } from '../pages/secret-list/secret-list.page';
import { Secret } from './secret';
import { SecretRepository } from './secret.repository';

@Injectable({
  providedIn: 'root'
})
export class SecretListMenuController {
  private secretListPage: SecretListPage;

  constructor(
    private modal: ModalController,
    private popover: PopoverController,
    private loading: AppLoadingController,
    private repository: SecretRepository,
  ) { }

  async showMenu(event: any, secretListPage: SecretListPage): Promise<HTMLIonPopoverElement> {
    this.secretListPage = secretListPage;
    const popover = await this.popover.create({
      component: SecretListMenuComponent,
      event: event,
      translucent: true
    });
    await popover.present();
    return popover;
  }

  async execMenuAction(action: string): Promise<void> {
    if (action === 'select') {
      this.secretListPage.secrets.subscribe(async (_secrets) => {
        const data = await this.showItemsToSelect(_secrets);
        // const data = await this.showItemsToSelect(this.secretListPage.secrets);
        if (data && data.action === 'remove')
          this.remove(data.items);
        console.log('selected', data);
      });
    }
  }

  private async showItemsToSelect(secrets: Secret[]): Promise<{ action: string, items: Secret[] }> {
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
    await this.loading.show('secrets.list.loading-remove');
    const sub1 = this.repository.getAll().subscribe((currItems) => {
      const toRemove = currItems.filter(ci => items.some(i => i.id === ci.id));
      console.log('to remove', toRemove)
      toRemove.forEach(i => {
        i.removed = true;
        i.modified = DateUtils.getUtcTime()
      })
      const sub2 = this.repository.saveAll(currItems).subscribe(() => {
        this.loading.dismiss()
        this.secretListPage.loadSecrets();
        sub2.unsubscribe();
        sub1.unsubscribe();
      })
    });
  }
}
