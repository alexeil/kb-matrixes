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
  dragOverIndex: number | null = null;

  @ViewChildren('slotDropList') slotDropLists!: QueryList<CdkDropList>;

  constructor(private cdr: ChangeDetectorRef) { }


  get slotDropListsArray(): CdkDropList[] {
    return this.slotDropLists ? this.slotDropLists.toArray() : [];
  }


  ngOnChanges(changes: SimpleChanges) {

    console.log('Changes detected:', changes);
    // Always update schedule when fields or categories change
    const allGames = this.flattenGames();
    this.unassignedGames = [...allGames];
    // Create an array for each field
    this.scheduledGames = Array(this.fields).fill(null).map(() => Array(allGames.length).fill(null));
    
    console.log('Unassigned games:', this.unassignedGames);
    console.log('Scheduled games:', this.scheduledGames);
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

  // --- Simplified Drag-and-Drop Logic ---

  /**
   * Handles dropping a game into a schedule field.
   * - From unassigned: assign to the dropped slot if empty.
   * - From same field: reorder within field.
   * - From another field: move to the dropped slot if empty.
   * If the slot is not empty, do nothing.
   */
  dropToSchedule(event: CdkDragDrop<any>, fieldIdx: number) {
    const currList = this.scheduledGames[fieldIdx];
    const dropIdx = event.currentIndex;

    console.log('Drop event:', event, 'Field index:', fieldIdx, 'Drop index:', dropIdx);
    if (event.previousContainer === event.container) {
      // Reorder within the same field
      const draggables = this.getDraggableGames(fieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const currIdx = draggables[event.currentIndex].index;
      const [moved] = currList.splice(prevIdx, 1, null);
      currList.splice(currIdx, 0, moved);
      currList.splice(currIdx + 1, 1); // Remove the null after insert
    } else if (event.previousContainer.id === 'unassignedGamesList') {
      // Assign from unassigned: place in the dropped slot if empty
      const game = this.unassignedGames[event.previousIndex];
      if (currList[dropIdx] == null) {
        this.unassignedGames.splice(event.previousIndex, 1);
        currList[dropIdx] = game;
      }
    } else {
      // Move from another field: place in the dropped slot if empty
      const prevList = event.previousContainer.data;
      const fromFieldIdx = this.scheduledGames.findIndex(list => list === prevList);
      const draggables = this.getDraggableGames(fromFieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const game = prevList[prevIdx];
      if (currList[dropIdx] == null) {
        prevList[prevIdx] = null;
        currList[dropIdx] = game;
      }
    }
    this.scheduledGames = [...this.scheduledGames];
    this.unassignedGames = [...this.unassignedGames];
    this.cdr.detectChanges();
  }

  /**
   * Handles dropping a game into a specific slot of a schedule field.
   * Allows dropping directly into any slot, including empty ones.
   */
  dropToScheduleSlot(event: any, fieldIdx: number, slotIdx: number) {
    console.log('[DND] dropToScheduleSlot called', { event, fieldIdx, slotIdx });
    const currList = this.scheduledGames[fieldIdx];
    console.log('[DND] previousContainer.id:', event.previousContainer?.id, 'container.id:', event.container?.id);
    // If coming from unassigned
    if (event.previousContainer.id === 'unassignedGamesList') {
      console.log('[DND] Branch: from unassigned');
      const game = this.unassignedGames[event.previousIndex];
      if (currList[slotIdx] == null) {
        // Normal insert if empty
        this.unassignedGames.splice(event.previousIndex, 1);
        currList[slotIdx] = game;
      } else {
        // Insert and shift right if occupied
        if (currList[currList.length - 1] == null) { // Only shift if there is space
          for (let i = currList.length - 1; i > slotIdx; i--) {
            currList[i] = currList[i - 1];
          }
          currList[slotIdx] = game;
          this.unassignedGames.splice(event.previousIndex, 1);
        }
      }
    } else if (event.previousContainer !== event.container) {
      console.log('[DND] Branch: from another field/slot');
      // From another field/slot
      const prevList = event.previousContainer.data;
      const fromFieldIdx = this.scheduledGames.findIndex(list => list === prevList);
      const draggables = this.getDraggableGames(fromFieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const game = prevList[prevIdx];
      if (currList[slotIdx] == null) {
        prevList[prevIdx] = null;
        currList[slotIdx] = game;
      } else {
        // Insert and shift right if occupied
        if (currList[currList.length - 1] == null) {
          for (let i = currList.length - 1; i > slotIdx; i--) {
            currList[i] = currList[i - 1];
          }
          currList[slotIdx] = game;
          prevList[prevIdx] = null;
        }
      }
    } else {
      console.log('[DND] Branch: reorder within same field');
      // Reorder within the same field
      const draggables = this.getDraggableGames(fieldIdx);
      const prevIdx = draggables[event.previousIndex].index;
      const currIdx = slotIdx;
      console.log('[DND] Reorder: prevIdx', prevIdx, 'currIdx', currIdx, 'currList before', JSON.stringify(currList));
      const [moved] = currList.splice(prevIdx, 1);
      console.log('[DND] After removal:', JSON.stringify(currList), 'moved:', moved);
      // Remove the first null (if any) to keep the list compact
      const nullIdx = currList.indexOf(null);
      if (nullIdx !== -1) {
        currList.splice(nullIdx, 1);
        console.log('[DND] After null removal:', JSON.stringify(currList));
      }
      currList.splice(currIdx, 0, moved);
      console.log('[DND] After insert:', JSON.stringify(currList));
      // If the list is now too long, trim the end
      if (currList.length > this.scheduledGames[fieldIdx].length) {
        currList.length = this.scheduledGames[fieldIdx].length;
        console.log('[DND] After trim:', JSON.stringify(currList));
      }
      // Fill with nulls to maintain length
      while (currList.length < this.scheduledGames[fieldIdx].length) {
        currList.push(null);
      }
      console.log('[DND] Final currList:', JSON.stringify(currList));
    }
    this.scheduledGames = [...this.scheduledGames];
    this.unassignedGames = [...this.unassignedGames];
    this.cdr.detectChanges();
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
}