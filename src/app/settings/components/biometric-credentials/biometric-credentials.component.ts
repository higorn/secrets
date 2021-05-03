import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-biometric-credentials',
  templateUrl: './biometric-credentials.component.html',
  styleUrls: ['./biometric-credentials.component.scss'],
})
export class BiometricCredentialsComponent implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  password: string;

  constructor(private modal: ModalController) {}

  ngOnInit() {}

  cancel(): void {
    this.modal.dismiss({});
  }

  save(): void {
    this.modal.dismiss({ password: this.password });
  }

  showSecret(): void {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }
}
