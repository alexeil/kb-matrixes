import { Component, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
  @Input() fields: number = 1;

  unassignedGames: ScheduledGame[] = [];
  scheduledGames: (ScheduledGame | null)[][] = [];

  @ViewChildren('slotDropList') slotDropLists!: QueryList<CdkDropList>;

  constructor(private cdr: ChangeDetectorRef) { }


  get slotDropListsArray(): CdkDropList[] {
    return this.slotDropLists ? this.slotDropLists.toArray() : [];
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] || changes['fields']) {
      const allGames = this.flattenGames();
      this.unassignedGames = [...allGames];
      // Create an array for each field
      this.scheduledGames = Array(this.fields).fill(null).map(() => Array(allGames.length).fill(null));
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

  // Helper to generate drop list ids for each field
  getDropListId(fieldIdx: number): string {
    return `scheduledGamesList_${fieldIdx}`;
  }

  get dropListIds(): string[] {
    // One for each field, plus the unassigned list
    const ids = [];
    for (let i = 0; i < this.fields; i++) {
      ids.push(this.getDropListId(i));
    }
    ids.push('unassignedGamesList');
    return ids;
  }

  // Helper: get the draggable games and their indices for a field
  getDraggableGames(fieldIdx: number): { game: ScheduledGame, index: number }[] {
    return this.scheduledGames[fieldIdx]
      .map((game, idx) => game ? { game, index: idx } : null)
      .filter((x): x is { game: ScheduledGame, index: number } => x !== null);
  }

  // Update dropToSchedule to use slot index
  dropToSchedule(event: CdkDragDrop<any>, fieldIdx: number) {
    const currList = this.scheduledGames[fieldIdx];
    if (event.previousContainer === event.container) {
      // Reorder within the same field
      const draggables = this.getDraggableGames(fieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const currIdx = draggables[event.currentIndex].index;
      const [moved] = currList.splice(prevIdx, 1, null);
      currList.splice(currIdx, 0, moved);
      currList.splice(currIdx + 1, 1); // Remove the null after insert
    } else {
      // Assign from unassigned or another field
      const prevList = event.previousContainer.data;
      const fromUnassigned = prevList === this.unassignedGames;
      let game;
      if (fromUnassigned) {
        game = this.unassignedGames[event.previousIndex];
        this.unassignedGames.splice(event.previousIndex, 1);
      } else {
        // From another field
        const fromFieldIdx = this.scheduledGames.findIndex(list => list === prevList);
        const draggables = this.getDraggableGames(fromFieldIdx);
        const prevIdx = draggables[event.previousIndex].index;
        game = prevList[prevIdx];
        prevList[prevIdx] = null;
      }
      // Find the first empty slot in this field
      const draggables = this.getDraggableGames(fieldIdx);
      let insertIdx = draggables.length > event.currentIndex ? draggables[event.currentIndex].index : currList.findIndex(g => g == null);
      if (insertIdx === -1) insertIdx = currList.length - 1;
      currList[insertIdx] = game;
    }
    this.scheduledGames = [...this.scheduledGames];
    this.unassignedGames = [...this.unassignedGames];
    this.cdr.detectChanges();
  }

  // Accept CdkDragDrop<any> for compatibility with Angular CDK event typing
  dropToUnassigned(event: CdkDragDrop<any>) {
    const prevList = event.previousContainer.data as (ScheduledGame | null)[];
    const prevIndex = event.previousIndex;
    const game = prevList[prevIndex];
    if (game) {
      this.unassignedGames.push(game);
      prevList[prevIndex] = null;
      this.scheduledGames = [...this.scheduledGames];
      this.unassignedGames = [...this.unassignedGames];
      this.cdr.detectChanges();
    }
  }

  // Update deassignGame to use null for empty slots, matching the fix in dropToUnassigned and keeping the schedule structure consistent
  deassignGame(fieldIdx: number, index: number) {
    const game = this.scheduledGames[fieldIdx][index];
    if (game) {
      this.unassignedGames.push(game);
      this.scheduledGames[fieldIdx][index] = null;
      this.scheduledGames = [...this.scheduledGames];
      this.unassignedGames = [...this.unassignedGames];
      this.cdr.detectChanges();
    }
  }

  canDropIntoSlot = (drag: any, drop: any) => {
    console.log('Checking if can drop into slot:', drag, drop);
    // Get slot index from drop element's data-index attribute
    const slotIndex = +drop.element.nativeElement.getAttribute('data-index');
    return !this.scheduledGames[slotIndex];
  };
}