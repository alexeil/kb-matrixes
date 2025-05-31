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

    if (event.previousContainer.id === 'unassignedGamesList') {
      // From unassigned to fields (any field, any slot)
      const game = this.unassignedGames[event.previousIndex];
      this.unassignedGames.splice(event.previousIndex, 1);
      this.scheduledGames[fieldIdx].splice(slotIdx, 0, game);
    } else {
      // From another field or reordering within the same field
      const fromGame = this.scheduledGames[fromFieldIdx][fromSlotIdx];
      this.scheduledGames[fromFieldIdx].splice(fromSlotIdx, 1);
      this.scheduledGames[fieldIdx].splice(slotIdx, 0, fromGame);
    }

    // Ensure the scheduled games and unassigned games are updated
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

    if (event.previousContainer.id === 'unassignedGamesList') {
      // Reordering case
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;

      const game = this.unassignedGames[previousIndex];
      this.unassignedGames.splice(event.previousIndex, 1);
      this.unassignedGames.splice(currentIndex, 0, game);

      console.log(`Moved game from index ${previousIndex} to ${currentIndex} in unassigned games.`);
    } else {
      // From another field to unassigned
      const fromFieldIdx = event.previousContainer.data.fieldIdx;
      const fromSlotIdx = event.previousContainer.data.slotIdx;
      const fromGame = this.scheduledGames[fromFieldIdx][fromSlotIdx];

      if (fromGame) {
        this.scheduledGames[fromFieldIdx][fromSlotIdx] = null;
        this.unassignedGames.splice(event.currentIndex, 0, fromGame);
      }

      console.log(`Moved game from field ${fromFieldIdx}, slot ${fromSlotIdx} to unassigned.`);
    }

    // Ensure the scheduled games and unassigned games are updated
    this.scheduledGames = [...this.scheduledGames];
    this.unassignedGames = [...this.unassignedGames];
    this.cdr.detectChanges();
  }
}