import { Component, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Category } from '../../models/category';
import { ChangeDetectorRef } from '@angular/core';
import { ScheduledGame } from '../../models/scheduled-game';

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
  dragOverIndex: number | null = null;

  @ViewChildren('slotDropList') slotDropLists!: QueryList<CdkDropList>;

  constructor(private cdr: ChangeDetectorRef) { }

  get slotDropListsArray(): CdkDropList[] {
    return this.slotDropLists ? this.slotDropLists.toArray() : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    // Always update schedule when fields or categories change
    const allGames = this.flattenGames();
    this.unassignedGames = [...allGames];
    // Create an array for each field
    this.scheduledGames = Array(this.fields)
      .fill(null)
      .map(() => Array(allGames.length)
        .fill(null));
    this.cdr.detectChanges();
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
    const ids: string[] = [];
    for (let field = 0; field < this.scheduledGames.length; field++) {
      for (let slot = 0; slot < this.scheduledGames[field].length; slot++) {
        ids.push(`field-${field}-slot-${slot}`);
      }
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
  /**
   * Handles dropping a game into a field slot.
   * - If dropping from unassigned, place in the slot if empty.
   * - If reordering within the same field, reorder the games.
   * - If moving from another field, swap the games if both slots are occupied.
   */
  dropToSchedule(event: CdkDragDrop<any>) {
    const fromFieldIdx = event.previousContainer.data.fieldIdx;
    const fromSlotIdx = event.previousContainer.data.slotIdx;
    const { fieldIdx, slotIdx } = event.container.data;
    const currentFieldScheduledGames = this.scheduledGames[fieldIdx];

    if (event.previousContainer === event.container) {
      // Reorder within the same field
      const draggables = this.getDraggableGames(fieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const currIdx = draggables[event.currentIndex].index;
      const [moved] = currentFieldScheduledGames.splice(prevIdx, 1, null);
      currentFieldScheduledGames.splice(prevIdx, 1);
      currentFieldScheduledGames.splice(currIdx, 0, moved);
      currentFieldScheduledGames.length = this.scheduledGames[fieldIdx].length;
    } else if (event.previousContainer.id === 'unassignedGamesList') {
      // Assign from unassigned: place in the dropped slot if empty
      const game = this.unassignedGames[event.previousIndex];
      if (currentFieldScheduledGames[slotIdx] == null) {
        this.unassignedGames.splice(event.previousIndex, 1);
        currentFieldScheduledGames[slotIdx] = game;
      }
    } else {
      // Move from another field: place in the dropped slot if empty
      const fromGame = this.scheduledGames[fromFieldIdx][fromSlotIdx];
      const toGame = this.scheduledGames[fieldIdx][slotIdx];
      this.scheduledGames[fromFieldIdx][fromSlotIdx] = toGame;
      this.scheduledGames[fieldIdx][slotIdx] = fromGame;
    }
    this.scheduledGames = [...this.scheduledGames];
    this.unassignedGames = [...this.unassignedGames];
    this.cdr.detectChanges();
  }

  canDropIntoSlot = (drag: any, drop: any) => {
    console.log('Checking if can drop into slot:', drag, drop);
    // Get slot index from drop element's data-index attribute
    const slotIndex = +drop.element.nativeElement.getAttribute('data-index');
    return !this.scheduledGames[slotIndex];
  };

  onDragEntered(idx: number) {
    this.dragOverIndex = idx;
  }

  onDragExited(idx: number) {
    if (this.dragOverIndex === idx) {
      this.dragOverIndex = null;
    }
  }

  /**
   * Handles dropping a game back to the unassigned list (from a field).
   */
  dropToUnassigned(event: CdkDragDrop<any>) {
    // Only allow dropping from a field, not reordering unassigned
    if (event.previousContainer.id !== 'unassignedGamesList') {
      const prevList = event.previousContainer.data as (ScheduledGame | null)[];
      const draggables = prevList
        .map((game, idx) => game ? { game, index: idx } : null)
        .filter((x): x is { game: ScheduledGame, index: number } => x !== null);
      const prevIdx = draggables[event.previousIndex].index;
      const game = prevList[prevIdx];
      if (game) {
        this.unassignedGames.push(game);
        prevList[prevIdx] = null;
        this.scheduledGames = [...this.scheduledGames];
        this.unassignedGames = [...this.unassignedGames];
        this.cdr.detectChanges();
      }
    }
  }
}