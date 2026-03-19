import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Secret } from '../../shared/secret';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  @Input() secrets: Secret[] = [];

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  cancel(): void {
    this.modal.dismiss({ cancel: true });
  }

  import(): void {
    setTimeout(() => {
      this.modal.dismiss({ secrets: this.secrets.filter(s => s.imported) });
    })
  }
}
