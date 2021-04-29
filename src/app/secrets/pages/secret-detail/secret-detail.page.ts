import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  form = this.fb.group({})
  fields = []
  private getByIdSubscription: Subscription
  private routeSubscription: Subscription

  constructor(
    private repository: SecretRepository,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnDestroy(): void {
    this.getByIdSubscription && this.getByIdSubscription.unsubscribe()
    this.routeSubscription && this.routeSubscription.unsubscribe()
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.getByIdSubscription = this.repository.getById(id).subscribe(secret => {
        this.secret = secret || new Secret(uuid(), id, null, null);
        this.createForm(secret?.type || id);
        if (this.secret.content) {
          this.title = 'View secret'
          this.isReadonly = true
          this.form.setValue(this.secret.content);
        }
      })
    });
  }
  createForm(type: string) {
    this.fields = FormType[type]
    for (let field of this.fields) {
      const c = new FormControl();
      if (field.options.required)
        c.setValidators(Validators.required)
      this.form.addControl(field.name, c)
    }
  }

  save() {
    if (this.isFormNotEmpty()) {
      this.secret.name = this.form.value.title;
      this.secret.content = this.form.value;
      this.repository.save(this.secret);
    }
    this.router.navigate(['/tabs/secrets'])
  }
  private isFormNotEmpty(): boolean {
    return Object.keys(this.form.value).some(k => this.form.value[k])
  }

  showSecret(field: any) {
    const t = field.options.type;
    field.options.type = t === 'password' ? "text" : "password";
  }

  remove() {
    this.presentConfirmation();
  }

  async presentConfirmation() {
    const alert = await this.alertController.create({
      header: "Remove confirmation",
      message: "Are you sure you want to remove this secret?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        }, {
          text: "Yes",
          handler: () => {
            this.repository.remove(this.secret);
            this.router.navigate(['/tabs/secrets'])
          }
        }
      ]
    });
    await alert.present();
  }
}
