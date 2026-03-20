import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslatorService } from 'src/app/shared/translator.service';
import { Secret } from '../../shared/secret';

@Component({
  standalone: false,
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.scss'],
})
export class SelectItemsComponent implements OnInit {
  @Input() items: Secret[] = [];
  private _selectAll = false;

  constructor(
    private modal: ModalController,
    private alert: AlertController,
    private translator: TranslatorService,
  ) { }

  ngOnInit() {}


  cancel(): void {
    this.modal.dismiss({ cancel: true });
  }

  selectAll(): void {
    this._selectAll = !this._selectAll;
    this.items.forEach(i => i.content.selected = this._selectAll)
  }

  get isSomeSelected(): boolean {
    return this.items.some(i => i.content.selected);
  }

  async removeSelected(): Promise<void> {
    const text = this.getTextForAlert();
    const alert = await this.alert.create({
      header: text.title,
      message: text.message,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: text.yes,
          handler: () => {
            setTimeout(() => {
              this.modal.dismiss({ action: 'remove', items: this.items.filter(s => s.content.selected) });
            })
          }
        },
      ],
    });
    await alert.present();
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

  private getTextForAlert(): any {
    let text: any = {};
    this.translator.get('secrets.select.remove.title').subscribe((t) => (text.title = t));
    this.translator.get('secrets.select.remove.message').subscribe((t) => (text.message = t));
    this.translator.get('secrets.select.remove.cancel').subscribe((t) => (text.cancel = t));
    this.translator.get('secrets.select.remove.yes').subscribe((t) => (text.yes = t));
    return text;
  }
}
