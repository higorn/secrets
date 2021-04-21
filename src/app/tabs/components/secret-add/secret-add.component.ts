import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-secret-add',
  templateUrl: './secret-add.component.html',
  styleUrls: ['./secret-add.component.scss'],
})
export class SecretAddComponent implements OnInit {
  @Output() eventSelectType: EventEmitter<string> = new EventEmitter<string>();
  types = [
    { id: 'login', name: 'Login', icon: 'log-in-outline' },
    { id: 'card', name: 'Card', icon: 'card-outline' },
    { id: 'id', name: 'ID', icon: 'id-card-outline' },
    { id: 'pin', name: 'PIN', icon: 'key' },
  ]

  constructor() { }

  ngOnInit() {}

  onClick(type: string) {
    this.eventSelectType.emit(type);
  }
}
