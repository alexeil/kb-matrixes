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
      previousContainer: { data: component.unassignedGames },
      container: { data: component.scheduledGames[0] },
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
});
