import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass'
})
export class ScheduleComponent {
  @Input() matchMatrix: (string | number)[][] = []
  @Input() categoryName: string = '';
  @Input() scheduleStart: string = '10:00';
  @Input() scheduleInterval: number = 45; // minutes

  scheduleRows: any[] = [];

  ngOnInit() {
    this.scheduleRows = this.generateScheduleRows();
  }

  generateScheduleRows() {
    // Only store teams, not time
    return this.matchMatrix.map(row => ({
      teams: [row[1], row[2], row[3]]
    }));
  }

  getTimeForIndex(index: number): string {
    let [hour, minute] = this.scheduleStart.split(':').map(Number);
    let totalMinutes = hour * 60 + minute + index * this.scheduleInterval;
    let h = Math.floor(totalMinutes / 60);
    let m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.scheduleRows, event.previousIndex, event.currentIndex);
    // No need to recalculate times, as getTimeForIndex will always reflect the new order
  }
}