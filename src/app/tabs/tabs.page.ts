import { TranslatorService } from './../shared/translator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterBtnService } from '../shared/master-btn.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  masterBtnAction = 'add';

  constructor(
    private router: Router,
    private translate: TranslatorService,
    private masterBtnService: MasterBtnService
  ) {}

  ngOnInit(): void {
    this.masterBtnService.actionChange$.subscribe((action) => {
      setTimeout(() => {
        this.masterBtnAction = action
      })
    });
  }

  ionViewDidEnter() {
    this.masterBtnService.changeAction('add');
  }

  onMasterBtnClick(type: string) {
    console.log('tabs: onMasterClick:', type)
    if (type !== 'edit' && type !== 'save') {
      this.router.navigate(['/tabs/secrets', type]);
      return;
    }
    this.masterBtnService.doAction(type);
  }
}
