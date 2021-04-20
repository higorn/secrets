import { Component, OnInit } from '@angular/core';
import { SecretDetailPage } from '../../pages/secret-detail/secret-detail.page';

@Component({
  selector: 'app-secret-types',
  templateUrl: './secret-types.component.html',
  styleUrls: ['./secret-types.component.scss'],
})
export class SecretTypesComponent implements OnInit {
  types = [
    { name: 'Login', page: SecretDetailPage }
  ];

  constructor() { }

  ngOnInit() {}
}
