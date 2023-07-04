import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {

  private state = {};

  constructor() { }

  setState(key, value) {
    if (this.state[key]) {
      this.state[key].value = value;
      this.state[key].behaviorSubject.next(value);
    } else {
      this.state[key] = createInitialState(value);
    }
  }

  getState(key) {
    return this.state[key].value;
  }

  observeState(key): BehaviorSubject<any> {
    if (this.state[key]) {
      return this.state[key].behaviorSubject;
    } else {
      this.state[key] = createInitialState(undefined);
      return this.state[key].behaviorSubject;
    }
  }

}

function createInitialState(value) {
  let state = {
    value,
    behaviorSubject: new BehaviorSubject(value)
  };

  return state;
}
