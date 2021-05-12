import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import 'capacitor-autofill-service';
import { map } from 'rxjs/operators';

const { Autofill} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AutofillService {

  constructor() { }

  isAvailable(): Observable<boolean> {
    return from(Autofill.isAvailable()).pipe(map((res: any) => res.isAvailable));
  }

  enable(): Observable<any> {
    console.log('autofill enabled')
    return from(Autofill.enable());
  }

  disable(): Observable<any> {
    console.log('autofill enabled')
    return from(Autofill.disable());
  }

  isEnabled(): Observable<boolean> {
    return from(Autofill.isEnabled()).pipe(map((res: any) => res.isEnabled));
  }
}
