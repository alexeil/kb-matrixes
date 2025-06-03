import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScheduleConfigService {
  private scheduleStartSubject = new BehaviorSubject<string>('10:00');
  private scheduleIntervalSubject = new BehaviorSubject<number>(45);
  private fieldsSubject = new BehaviorSubject<number>(1);
  private scheduleDateSubject = new BehaviorSubject<string>('');
  private numberOfSetsSubject = new BehaviorSubject<number>(3);
  private locationSubject = new BehaviorSubject<string>('');

  scheduleStart$ = this.scheduleStartSubject.asObservable();
  scheduleInterval$ = this.scheduleIntervalSubject.asObservable();
  fields$ = this.fieldsSubject.asObservable();
  scheduleDate$ = this.scheduleDateSubject.asObservable();
  numberOfSets$ = this.numberOfSetsSubject.asObservable();
  location$ = this.locationSubject.asObservable();

  get scheduleStart() {
    return this.scheduleStartSubject.value;
  }
  get scheduleInterval() {
    return this.scheduleIntervalSubject.value;
  }
  get fields() {
    return this.fieldsSubject.value;
  }
  get scheduleDate() {
    return this.scheduleDateSubject.value;
  }
  get numberOfSets() {
    return this.numberOfSetsSubject.value;
  }
  get location() {
    return this.locationSubject.value;
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
  setScheduleDate(val: string) {
    this.scheduleDateSubject.next(val);
  }
  setNumberOfSets(val: number) {
    this.numberOfSetsSubject.next(val);
  }
  setLocation(val: string) {
    this.locationSubject.next(val);
  }
}
