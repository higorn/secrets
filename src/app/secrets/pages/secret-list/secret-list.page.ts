import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppLoadingController } from 'src/app/shared/app-loading.controller';
import { ImportService } from '../../../shared/import.service';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';
import { ImportComponent } from './../../components/import/import.component';
import { SecretListMenuController } from '../../shared/secret-list-menu.controller';

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
    private loading: AppLoadingController,
    private menuController: SecretListMenuController
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

    await this.loading.show('secrets.list.loading-import');
    const sub1 = this.repository.getAll().subscribe((items) => {
      const collection = items.concat(secrets);
      const sub2 = this.repository.saveAll(collection).subscribe(() => {
        this.loading.dismiss();
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
    const menu = await this.menuController.showMenu(event, this);
    const { role } = await menu.onDidDismiss();
    this.menuController.execMenuAction(role);
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
