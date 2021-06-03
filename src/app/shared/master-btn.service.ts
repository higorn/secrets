import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterBtnService {
  private actionChangeSource = new Subject<string>();
  private onClickSource = new Subject<string>();
  actionChange$ = this.actionChangeSource.asObservable();
  onClick$ = this.onClickSource.asObservable();

  constructor() { }

  changeAction(action: string): void {
    this.actionChangeSource.next(action);
  }

  doAction(action: string): void {
    this.onClickSource.next(action);
  }
}
