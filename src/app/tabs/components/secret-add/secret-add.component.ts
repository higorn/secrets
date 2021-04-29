import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-secret-add',
  templateUrl: './secret-add.component.html',
  styleUrls: ['./secret-add.component.scss'],
})
export class SecretAddComponent implements OnInit {
  @Output() eventSelectType: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onClick(type: string) {
    this.eventSelectType.emit(type);
  }
}
