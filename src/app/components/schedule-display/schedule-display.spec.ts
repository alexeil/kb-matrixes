import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDisplay } from './schedule-display';

describe('ScheduleDisplay', () => {
  let component: ScheduleDisplay;
  let fixture: ComponentFixture<ScheduleDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
