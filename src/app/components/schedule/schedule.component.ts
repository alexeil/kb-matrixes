import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass'
})

export class ScheduleComponent {
  @Input() matchMatrix: (string | number)[][] = []

  categoryName: string = '';
  scheduleStart: string = '10:00';
  scheduleInterval: number = 45; // minutes

  get scheduleRows() {
    const rows = [];
    let [hour, minute] = this.scheduleStart.split(':').map(Number);

    for (let i = 0; i < this.matchMatrix.length; i++) {
      // Format time
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      // Get team names for this match
      const teams = [
        this.matchMatrix[i][1],
        this.matchMatrix[i][2],
        this.matchMatrix[i][3]
      ];
      rows.push({ time, teams });
      // Add interval
      minute += this.scheduleInterval;
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
    return rows;
  }
}