import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  cancel(): void {
    this.modal.dismiss({ cancel: true });
  }

  openChrome(): void {
    this.modal.dismiss({ import: true });
  }
}
