import { Component, OnInit } from '@angular/core';
import { SecretTypesComponent } from './../../components/secret-types/secret-types.component';

@Component({
  selector: 'app-secret-new',
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
})
export class SecretNewPage implements OnInit {
  rootPage = SecretTypesComponent;

  constructor() { }

  ngOnInit() {
  }
}
