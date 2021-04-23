import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SecretRepository } from 'src/app/shared/secret.repository';
import { v4 as uuid } from 'uuid';
import { Secret } from '../../shared/secret';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.page.html',
  styleUrls: ['./secret-detail.page.scss'],
})
export class SecretDetailPage implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  isReadonly = false;
  secret: Secret;
  title = 'New Secret';
  form = this.fb.group({
    name: ['', [Validators.required]],
    user: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private repository: SecretRepository,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.repository.getById(id).subscribe(secret => {
        this.secret = secret || new Secret(uuid(), id, null, null);
        if (this.secret.content) {
          this.title = 'View secret'
          this.isReadonly = true
          // this.form.disable();
          this.form.setValue(this.secret.content);
        }
      })
    });
  }

  save() {
    this.secret.name = this.form.value.name;
    this.secret.content = this.form.value;
    this.repository.save(this.secret);
    this.form.reset();
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }

  remove() {
    this.presentConfirmation();
  }

  async presentConfirmation() {
    const alert = await this.alertController.create({
      header: "Remove confirmation",
      message: "Are you sure?",
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
