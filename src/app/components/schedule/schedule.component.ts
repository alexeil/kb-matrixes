import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Category } from '../../models/category';

interface ScheduledGame {
  categoryName: string;
  teams: string[];
  originalCategoryIndex: number;
  originalGameIndex: number;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass'
})
export class ScheduleComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() scheduleStart: string = '10:00';
  @Input() scheduleInterval: number = 45;
  scheduleRows: ScheduledGame[] = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log('ScheduleComponent changes:', changes);
    if (changes['categories']) {
      this.scheduleRows = this.flattenGames();
    }
  }

  flattenGames(): ScheduledGame[] {
    const games: ScheduledGame[] = [];
    this.categories.forEach((cat, catIdx) => {
      (cat.displayMatrix || []).forEach((row, gameIdx) => {
        games.push({
          categoryName: cat.name,
          teams: [String(row[1]), String(row[2]), String(row[3])],
          originalCategoryIndex: catIdx,
          originalGameIndex: gameIdx
        });
      });
    });
    return games; 
  }

  getTimeForIndex(index: number, start: string, interval: number): string {
    let [hour, minute] = start.split(':').map(Number);
    let totalMinutes = hour * 60 + minute + index * interval;
    let h = Math.floor(totalMinutes / 60);
    let m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  drop(event: CdkDragDrop<ScheduledGame[]>) {
    moveItemInArray(this.scheduleRows, event.previousIndex, event.currentIndex);
    // After this, the order of scheduleRows reflects the new schedule
  }
}