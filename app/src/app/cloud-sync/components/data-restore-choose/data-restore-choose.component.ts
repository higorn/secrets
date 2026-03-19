import { ModalController } from '@ionic/angular';
import { SyncFile } from 'src/app/shared/cloud-sync/cloud-sync.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-restore-choose',
  templateUrl: './data-restore-choose.component.html',
  styleUrls: ['./data-restore-choose.component.scss'],
})
export class DataRestoreChooseComponent implements OnInit {
  @Input() files: SyncFile[]
  file: SyncFile

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  cancel(): void {
    this.modal.dismiss({ cancel: true });
  }

  select(): void {
    setTimeout(() => {
      this.modal.dismiss({ file: this.file });
    })
  }
}
