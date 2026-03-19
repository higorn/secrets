import { Injectable } from '@angular/core';
import { Autofill } from 'capacitor-autofill-service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AutofillService } from './autofill.service';

@Injectable({
  providedIn: 'root'
})
export class NativeAutofillService extends AutofillService {

  constructor() {
    super();
  }

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
