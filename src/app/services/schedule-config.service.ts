import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScheduleConfigService {
  private scheduleStartSubject = new BehaviorSubject<string>('10:00');
  private scheduleIntervalSubject = new BehaviorSubject<number>(45);
  private fieldsSubject = new BehaviorSubject<number>(1);

  scheduleStart$ = this.scheduleStartSubject.asObservable();
  scheduleInterval$ = this.scheduleIntervalSubject.asObservable();
  fields$ = this.fieldsSubject.asObservable();

  get scheduleStart() {
    return this.scheduleStartSubject.value;
  }
  get scheduleInterval() {
    return this.scheduleIntervalSubject.value;
  }
  get fields() {
    return this.fieldsSubject.value;
  }

  setScheduleStart(val: string) {
    this.scheduleStartSubject.next(val);
  }
  setScheduleInterval(val: number) {
    this.scheduleIntervalSubject.next(val);
  }
  setFields(val: number) {
    this.fieldsSubject.next(val);
  }
}
