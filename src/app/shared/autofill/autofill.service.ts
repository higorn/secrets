import { Observable } from 'rxjs';


export abstract class AutofillService {

  constructor() { }

  abstract isAvailable(): Observable<boolean>;
  abstract enable(): Observable<any>;
  abstract disable(): Observable<any>;
  abstract isEnabled(): Observable<boolean>;
}
