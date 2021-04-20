import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';
import { v4 as uuid } from 'uuid';
import { SecretTypesComponent } from '../../components/secret-types/secret-types.component';
import { Secret } from '../../shared/secret';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.page.html',
  styleUrls: ['./secret-detail.page.scss'],
})
export class SecretDetailPage implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  isAdd = false;
  secret: Secret;
  form = this.fb.group({
    name: ['', [Validators.required]],
    user: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  rootPage = SecretTypesComponent;

  constructor(
    private storage: SecretStorageService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('id:', id);
      this.secret = this.storage.get(id) || new Secret(uuid(), 'LOGIN', null, null);
      if (id && id !== 'new') {
        this.form.setValue(this.secret.content);
      } else
        this.isAdd = true;
    });
  }

  save() {
    this.secret.name = this.form.value.name;
    this.secret.content = this.form.value;
    this.storage.save(this.secret);
    this.form.reset();
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }
}
