import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-master-btn',
  templateUrl: './master-btn.component.html',
  styleUrls: ['./master-btn.component.scss'],
})
export class MasterBtnComponent implements OnInit {
  @Input() action = 'add';
  @Output() eventClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.action !== 'add' && this.eventClick.emit(this.action);
  }

  onAdd(type: string) {
    this.eventClick.emit(type);
  }

  get iconName() {
    switch(this.action) {
      case 'add': return 'add';
      case 'edit': return 'pencil-outline';
      case 'save': return 'checkmark-outline';
    }
  }
}
