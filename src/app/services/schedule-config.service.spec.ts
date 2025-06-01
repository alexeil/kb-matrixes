import { TestBed } from '@angular/core/testing';
import { ScheduleConfigService } from './schedule-config.service';

describe('ScheduleConfigService', () => {
  let service: ScheduleConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get schedule start', () => {
    service.setScheduleStart('09:30');
    expect(service.scheduleStart).toBe('09:30');
  });

  it('should set and get schedule interval', () => {
    service.setScheduleInterval(60);
    expect(service.scheduleInterval).toBe(60);
  });

  it('should set and get fields', () => {
    service.setFields(5);
    expect(service.fields).toBe(5);
  });
});
