import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Secret } from 'src/app/add-secret/shared/secret';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.page.html',
  styleUrls: ['./secret-detail.page.scss'],
})
export class SecretDetailPage implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  form = this.fb.group({
    name: ['', [Validators.required]],
    user: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private storage: SecretStorageService, private fb: FormBuilder) {}

  ngOnInit() {}

  addSecret() {
    this.storage.create(new Secret('LOGIN', this.form.value.name, this.form.value));
    this.form.reset();
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }
}
