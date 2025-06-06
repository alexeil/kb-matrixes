import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { CategoryStateService } from '../../services/category-state.service';
import { ScheduleConfigService } from '../../services/schedule-config.service';
import { ScheduleStateService } from '../../services/schedule-state.service';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let catState: CategoryStateService;
  let config: ScheduleConfigService;
  let schedState: ScheduleStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      imports: [CommonModule, DragDropModule, MatCardModule, MatTableModule, MatIconModule],
      providers: [CategoryStateService, ScheduleConfigService, ScheduleStateService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    catState = TestBed.inject(CategoryStateService);
    config = TestBed.inject(ScheduleConfigService);
    schedState = TestBed.inject(ScheduleStateService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not throw when assigning a game to a field (integration test)', (done) => {
    // Setup: 2 fields, 2 games
    config.setFields(2);
    catState.setCategories([
      { id: 1, name: 'Cat1', teams: ['A', 'B', 'C'], numberOfFields: 1, displayMatrix: [[0, 'A', 'B', 'C']] },
      { id: 2, name: 'Cat2', teams: ['D', 'E', 'F'], numberOfFields: 1, displayMatrix: [[0, 'D', 'E', 'F']] }
    ]);
    schedState.reset();
    fixture.detectChanges();

    // Wait for async init
    setTimeout(() => {
      expect(component.scheduledGames.length).toBe(2);
      expect(component.scheduledGames[0].length).toBe(2);
      expect(component.scheduledGames[1].length).toBe(2);
      expect(component.unassignedGames.length).toBe(2);

      // Simulate assigning the first unassigned game to the first slot of field 0
      const event = {
        previousContainer: { data: { fieldIdx: null, slotIdx: null }, id: 'unassignedGamesList' },
        container: { data: { fieldIdx: 0, slotIdx: 0 }, id: 'field-0-slot-0' },
        previousIndex: 0,
        currentIndex: 0
      } as any;
      expect(() => component.dropToSchedule(event)).not.toThrow();
      fixture.detectChanges();
      expect(component.scheduledGames[0][0]).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
      done();
    }, 0);
  });

  it('should handle dragging multiple unassigned games to different field slots', (done) => {
    config.setFields(2);
    catState.setCategories([
      { id: 1, name: 'Cat1', teams: ['A', 'B', 'C', 'D'], numberOfFields: 1, displayMatrix: [
        [0, 'A', 'B', 'C'],
        [1, 'B', 'C', 'D'],
        [2, 'A', 'C', 'D']
      ] }
    ]);
    schedState.reset();
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.unassignedGames.length).toBe(3);
      expect(component.scheduledGames.length).toBe(2);
      expect(component.scheduledGames[0].length).toBe(3);
      expect(component.scheduledGames[1].length).toBe(3);

      // Drag first game to the second slot of the first field
      const event1 = {
        previousContainer: { data: { fieldIdx: null, slotIdx: null }, id: 'unassignedGamesList' },
        container: { data: { fieldIdx: 0, slotIdx: 1 }, id: 'field-0-slot-1' },
        previousIndex: 0,
        currentIndex: 1
      } as any;
      expect(component.scheduledGames[0][1]).toBeNull();
      expect(() => component.dropToSchedule(event1)).not.toThrow();
      fixture.detectChanges();
      expect(component.scheduledGames[0][1]).toBeTruthy();
      expect(component.unassignedGames.length).toBe(2);

      // Drag second game (now at index 0) to the last slot of the second field
      const event2 = {
        previousContainer: { data: { fieldIdx: null, slotIdx: null }, id: 'unassignedGamesList' },
        container: { data: { fieldIdx: 1, slotIdx: 2 }, id: 'field-1-slot-2' },
        previousIndex: 0,
        currentIndex: 2
      } as any;
      expect(component.scheduledGames[1][2]).toBeNull();
      expect(() => component.dropToSchedule(event2)).not.toThrow();
      fixture.detectChanges();
      expect(component.scheduledGames[1][2]).toBeTruthy();
      expect(component.unassignedGames.length).toBe(1);

      // Drag third game (now at index 0) to the first slot of the first field
      const event3 = {
        previousContainer: { data: { fieldIdx: null, slotIdx: null }, id: 'unassignedGamesList' },
        container: { data: { fieldIdx: 0, slotIdx: 0 }, id: 'field-0-slot-0' },
        previousIndex: 0,
        currentIndex: 0
      } as any;
      expect(component.scheduledGames[0][0]).toBeNull();
      expect(() => component.dropToSchedule(event3)).not.toThrow();
      fixture.detectChanges();
      expect(component.scheduledGames[0][0]).toBeTruthy();
      expect(component.unassignedGames.length).toBe(0);

      // Check that exactly three slots are filled and the rest are null
      let filledCount = 0;
      for (let i = 0; i < component.scheduledGames.length; i++) {
        for (let j = 0; j < component.scheduledGames[i].length; j++) {
          if (component.scheduledGames[i][j]) {
            filledCount++;
          } else {
            expect(component.scheduledGames[i][j]).toBeNull();
          }
        }
      }
      expect(filledCount).toBe(3);
      expect(() => fixture.detectChanges()).not.toThrow();
      done();
    }, 0);
  });
});
