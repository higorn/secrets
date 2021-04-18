import { SecretStorageService } from './../../../shared/secret-storage.service';
import { Component } from '@angular/core';
import { Secret } from '../../shared/secret';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-secret',
  templateUrl: 'add-secret.page.html',
  styleUrls: ['add-secret.page.scss']
})
export class AddSecretPage {
  pwType = 'password';
  isPwVisible = false;
  form = this.fb.group({
    name: ['', [Validators.required]],
    user: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private storage: SecretStorageService, private fb: FormBuilder) {}

  addSecret() {
    this.storage.create(new Secret('LOGIN', this.form.value.name, this.form.value));
    this.form.reset();
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }
}
