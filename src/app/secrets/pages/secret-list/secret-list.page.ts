import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonList, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppLoadingController } from 'src/app/shared/app-loading.controller';
import { ImportService } from '../../../shared/import.service';
import { Secret } from '../../shared/secret';
import { SecretListMenuController } from '../../shared/secret-list-menu.controller';
import { SecretRepository } from '../../shared/secret.repository';
import { ImportComponent } from './../../components/import/import.component';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss'],
})
export class SecretListPage implements OnInit, OnDestroy {
  secrets: Secret[];
  displaySecrets: Secret[];
  private getAllSubscription: Subscription;

  constructor(
    private repository: SecretRepository,
    private importService: ImportService,
    private modal: ModalController,
    private loading: AppLoadingController,
    private menuController: SecretListMenuController
  ) {}

  ngOnDestroy(): void {
    this.getAllSubscription && this.getAllSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadSecrets();
  }

  loadSecrets() {
    this.getAllSubscription = this.repository.getAll().subscribe((secrets) => {
      this.secrets = secrets
      this.displaySecrets = this.secrets;

      if (this.importService.isAvailable()) {
        this.importService.getDataToImport().subscribe(async (data: Secret[]) => {
          console.log('Import', data)
          if (data && data.length)
            this.import(await this.chooseSecretsToImport(data));
        })
    }

      this.loading.dismiss();
    });
  }

  private async chooseSecretsToImport(secrets: Secret[]): Promise<Secret[]> {
    // const currSecrets = await this.secrets.toPromise();
    const currSecrets = this.secrets
    const toImport = secrets.filter(s1 => !currSecrets.some(s2 => s2.name === s1.name))
    const modal = await this.modal.create({
      component: ImportComponent,
      componentProps: {
        secrets: toImport
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data || data.cancel) return null;
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

  refresh(event: any): void {
    const sub = this.repository.refresh().subscribe(() => {
      sub.unsubscribe();
      event.target.complete()
    });
  }

  search(event: any) {
    const term = event.target.value.toLowerCase();
    this.displaySecrets = this.secrets.filter(s => s.name.toLowerCase().includes(term) || this.isSubtitleIncludes(s, term))
  }

  private isSubtitleIncludes(s: Secret, term: any): boolean {
    const subtitle = this.getItemSubtitle(s);
    return subtitle && subtitle.toLowerCase().includes(term);
  }

  async showMenu(event: any): Promise<void> {
    const menu = await this.menuController.showMenu(event, this);
    const { role } = await menu.onDidDismiss();
    this.menuController.execMenuAction(role);
  }

  getIcon(type: string) {
    switch (type) {
      case 'password':
        return 'key-outline';
      case 'card':
        return 'card-outline';
      case 'bank':
        return 'cash-outline';
      case 'identity':
        return 'id-card-outline';
      case 'info':
        return 'person-circle-outline';
      case 'note':
        return 'document-lock-outline'
    }
  }

  getItemSubtitle(secret: Secret): string {
    const keys = Object.keys(secret.content);
    return secret.content[keys[1]];
  }
}
