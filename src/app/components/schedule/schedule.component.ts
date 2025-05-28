import { Component, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Category } from '../../models/category';
import { ChangeDetectorRef } from '@angular/core';

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
export class ScheduleComponent implements OnChanges, AfterViewInit {
  @Input() categories: Category[] = [];
  @Input() scheduleStart: string = '10:00';
  @Input() scheduleInterval: number = 45;

  unassignedGames: ScheduledGame[] = [];
  scheduledGames: (ScheduledGame | null)[] = [];

  @ViewChildren('slotDropList') slotDropLists!: QueryList<CdkDropList>;

  constructor(private cdr: ChangeDetectorRef) { }


  get slotDropListsArray(): CdkDropList[] {
    return this.slotDropLists ? this.slotDropLists.toArray() : [];
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']) {
      const allGames = this.flattenGames();
      this.unassignedGames = [...allGames];
      this.scheduledGames = Array(allGames.length).fill(null);
    }
  }

  ngAfterViewInit() {
    // Needed for [cdkDropListConnectedTo]
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

  getTimeForIndex(index: number): string {
    let [hour, minute] = this.scheduleStart.split(':').map(Number);
    let totalMinutes = hour * 60 + minute + index * this.scheduleInterval;
    let h = Math.floor(totalMinutes / 60);
    let m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  dropToSchedule(event: CdkDragDrop<(ScheduledGame | null)[]>, slotIndex: number) {
    if (
      event.previousContainer !== event.container &&
      !this.scheduledGames[slotIndex]
    ) {
      this.scheduledGames[slotIndex] = event.previousContainer.data[event.previousIndex];
      this.unassignedGames.splice(event.previousIndex, 1);

      // Force update for Angular
      this.scheduledGames = [...this.scheduledGames];
      this.unassignedGames = [...this.unassignedGames];
      this.cdr.detectChanges();
    }
  }

  dropToUnassigned(event: CdkDragDrop<ScheduledGame[]>) {
    if (event.previousContainer !== event.container) {
      const slotDropListElem = event.previousContainer.element?.nativeElement;
      const slotIndexAttr = slotDropListElem?.getAttribute('data-index');
      if (slotIndexAttr !== null && slotIndexAttr !== undefined) {
        const slotIndex = +slotIndexAttr;
        const game = this.scheduledGames[slotIndex];
        if (game) {
          this.unassignedGames.push(game);
          this.scheduledGames[slotIndex] = null;

          // Force update for Angular
          this.scheduledGames = [...this.scheduledGames];
          this.unassignedGames = [...this.unassignedGames];
          this.cdr.detectChanges();
        }
      }
    }
  }

  canDropIntoSlot = (drag: any, drop: any) => {
    console.log('Checking if can drop into slot:', drag, drop);
    // Get slot index from drop element's data-index attribute
    const slotIndex = +drop.element.nativeElement.getAttribute('data-index');
    return !this.scheduledGames[slotIndex];
  };
}