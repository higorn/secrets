import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-secret-list-menu',
  templateUrl: './secret-list-menu.component.html',
  styleUrls: ['./secret-list-menu.component.scss'],
})
export class SecretListMenuComponent implements OnInit {

  constructor(
    private popover: PopoverController
  ) { }

  ngOnInit() {}

  select(): void {
    this.popover.dismiss({}, 'select');
  }
}
