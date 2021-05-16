import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { TranslatorService } from 'src/app/shared/translator.service';
import { v4 as uuid } from 'uuid';
import { FormType, Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.page.html',
  styleUrls: ['./secret-detail.page.scss'],
})
export class SecretDetailPage implements OnInit, OnDestroy {
  pwType = 'password';
  isPwVisible = false;
  isReadonly = false;
  secret: Secret;
  title = 'New Secret';
  form = this.fb.group({});
  fields = [];
  private getByIdSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private repository: SecretRepository,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslatorService,
    private alert: AlertController,
    private clipboard: ClipboardService,
    private toast: ToastController
  ) {}

  ngOnDestroy(): void {
    this.getByIdSubscription && this.getByIdSubscription.unsubscribe();
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.translate.get('secrets.form.new').subscribe((val) => (this.title = val));
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.getByIdSubscription = this.repository
        .getById(id)
        .subscribe((secret) => this.load(secret, id));
    });
  }

  private load(secret: Secret, id: string) {
    this.secret = secret || new Secret(uuid(), id, null, null);
    this.createForm(secret?.type || id);
    if (this.secret.content) {
      this.title = this.secret.name;
      this.isReadonly = true;
      this.form.setValue(this.secret.content);
    }
  }

  private createForm(type: string) {
    this.fields = FormType[type];
    for (let field of this.fields) {
      const c = new FormControl();
      if (field.options.required) c.setValidators(Validators.required);
      this.form.addControl(field.name, c);
    }
  }

  save() {
    if (this.isFormNotEmpty()) {
      this.secret.name = this.form.value.title;
      this.secret.content = this.form.value;
      this.repository.save(this.secret);
    }
    this.router.navigate(['/tabs/secrets']);
  }

  private isFormNotEmpty(): boolean {
    return Object.keys(this.form.value).some((k) => this.form.value[k]);
  }

  showSecret(field: any) {
    const t = field.options.type;
    field.options.type = t === 'password' ? 'text' : 'password';
  }

  edit(): void {
    this.isReadonly = !this.isReadonly;
  }

  async copyAll(): Promise<void> {
    const content = this.fields.filter(f => f.options.copyable).map(f => this.secret.content[f.name]).join('\r\n');
    this.clipboard.copyFromContent(content)
    await this.presetMessage();
  }

  async copy(field: any): Promise<void> {
    this.clipboard.copyFromContent(this.secret.content[field.name])
    await this.presetMessage();
  }

  private async presetMessage() {
    let message = '';
    this.translate.get('secrets.copied-to-clipboard').subscribe((t) => message = t);
    const toast = await this.toast.create({
      message: message,
      translucent: true,
      duration: 3000
    });
    toast.present();
  }

  remove() {
    this.presentConfirmation();
  }

  async presentConfirmation() {
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
            this.repository.remove(this.secret);
            this.router.navigate(['/tabs/secrets']);
          },
        },
      ],
    });
    await alert.present();
  }

  private getTextForAlert() {
    let text: any = {};

    this.translate.get('secrets.remove.title').subscribe((t) => (text.title = t));
    this.translate.get('secrets.remove.message').subscribe((t) => (text.message = t));
    this.translate.get('secrets.remove.cancel').subscribe((t) => (text.cancel = t));
    this.translate.get('secrets.remove.yes').subscribe((t) => (text.yes = t));
    return text;
  }
}
