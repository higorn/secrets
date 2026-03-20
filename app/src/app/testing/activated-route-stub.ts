import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 * Buffer size 1 so new subscribers only see the latest map (avoids replaying an
 * unbounded history from earlier tests).
 */
export class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>(1);

  readonly paramMap = this.subject.asObservable();

  /** Set the paramMap observable's next value */
  setParamMap(params: Params = {}) {
    this.subject.next(convertToParamMap(params));
  }
}