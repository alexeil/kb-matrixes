import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      imports: [CommonModule, DragDropModule, MatCardModule, MatTableModule, MatIconModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not throw when assigning a game to a field (integration test)', () => {
    // Setup: 2 fields, 2 games
    component.fields = 2;
    component.categories = [
      { id: 1, name: 'Cat1', teams: ['A', 'B', 'C'], numberOfFields: 1, displayMatrix: [[0, 'A', 'B', 'C']] },
      { id: 2, name: 'Cat2', teams: ['D', 'E', 'F'], numberOfFields: 1, displayMatrix: [[0, 'D', 'E', 'F']] }
    ];
    component.ngOnChanges({ categories: true, fields: true } as any);
    fixture.detectChanges();

    // Simulate assigning the first unassigned game to the first slot of field 0
    const event = {
      previousContainer: { data: component.unassignedGames, id: 'unassignedGamesList' },
      container: { data: component.scheduledGames[0], id: component.getDropListId(0) },
      previousIndex: 0,
      currentIndex: 0
    } as any;
    expect(() => component.dropToSchedule(event, 0)).not.toThrow();
    fixture.detectChanges();
    // The assigned slot should not be null or undefined
    expect(component.scheduledGames[0][0]).toBeTruthy();
    // The template should not throw when rendering
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should handle dragging multiple unassigned games to different field slots', () => {
    // Setup: 2 fields, 3 unassigned games
    component.fields = 2;
    component.categories = [
      { id: 1, name: 'Cat1', teams: ['A', 'B', 'C', 'D'], numberOfFields: 1, displayMatrix: [
        [0, 'A', 'B', 'C'],
        [1, 'B', 'C', 'D'],
        [2, 'A', 'C', 'D']
      ] }
    ];
    component.ngOnChanges({ categories: true, fields: true } as any);
    fixture.detectChanges();

    // There should be 3 unassigned games
    expect(component.unassignedGames.length).toBe(3);

    // Drag first game to the second slot of the first field
    let event1 = {
      previousContainer: { data: component.unassignedGames, id: 'unassignedGamesList' },
      container: { data: component.scheduledGames[0], id: component.getDropListId(0) },
      previousIndex: 0,
      currentIndex: 1
    } as any;
    expect(component.scheduledGames[0][1]).toBeNull();
    expect(() => component.dropToSchedule(event1, 0)).not.toThrow();
    fixture.detectChanges();
    expect(component.scheduledGames[0][1]).toBeTruthy();
    expect(component.unassignedGames.length).toBe(2);

    // Drag second game (now at index 0) to the last slot of the second field (should be index 2, but only if that slot is empty)
    let event2 = {
      previousContainer: { data: component.unassignedGames, id: 'unassignedGamesList' },
      container: { data: component.scheduledGames[1], id: component.getDropListId(1) },
      previousIndex: 0,
      currentIndex: 2
    } as any;
    expect(component.scheduledGames[1][2]).toBeNull();
    expect(() => component.dropToSchedule(event2, 1)).not.toThrow();
    fixture.detectChanges();
    expect(component.scheduledGames[1][2]).toBeTruthy();
    expect(component.unassignedGames.length).toBe(1);

    // Drag third game (now at index 0) to the first slot of the first field
    let event3 = {
      previousContainer: { data: component.unassignedGames, id: 'unassignedGamesList' },
      container: { data: component.scheduledGames[0], id: component.getDropListId(0) },
      previousIndex: 0,
      currentIndex: 0
    } as any;
    expect(component.scheduledGames[0][0]).toBeNull();
    expect(() => component.dropToSchedule(event3, 0)).not.toThrow();
    fixture.detectChanges();
    expect(component.scheduledGames[0][0]).toBeTruthy();
    expect(component.unassignedGames.length).toBe(0);

    // Check that no other slots are filled
    expect(component.scheduledGames[0][2]).toBeNull();
    expect(component.scheduledGames[1][0]).toBeNull();
    expect(component.scheduledGames[1][1]).toBeNull();

    // The template should not throw when rendering
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
