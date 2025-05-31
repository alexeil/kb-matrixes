import { Component, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from '../../models/category';
import { ChangeDetectorRef } from '@angular/core';
import { from } from 'rxjs';

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

  // --- Simplified Drag-and-Drop Logic ---

  /**
   * Handles dropping a game into a schedule field.
   * - From unassigned: assign to the dropped slot if empty.
   * - From same field: reorder within field.
   * - From another field: move to the dropped slot if empty.
   * If the slot is not empty, do nothing.
   */
  dropToSchedule(event: CdkDragDrop<any>) {
    const fromFieldIdx = event.previousContainer.data.fieldIdx;
    const fromSlotIdx = event.previousContainer.data.slotIdx;
    const { fieldIdx, slotIdx } = event.container.data;
    console.log('Drop event:', event, 'Field index:', fieldIdx, 'Slot index:', slotIdx);

    const currList = this.scheduledGames[fieldIdx];


    console.log('Drop event:', event, 'Field index:', fieldIdx, 'Drop index:', slotIdx);
    if (event.previousContainer === event.container) {
      // Reorder within the same field
      console.log('Reordering within the same field:', fieldIdx, 'event.container.id', event.container.id);
      const draggables = this.getDraggableGames(fieldIdx);
      console.log('Draggables:', draggables);


      const prevIdx = draggables[event.previousIndex].index;
      const currIdx = draggables[event.currentIndex].index;
      console.log('Previous index:', prevIdx, 'Current index:', currIdx);

      const [moved] = currList.splice(prevIdx, 1, null);
      console.log('Moved game:', moved, 'from index:', prevIdx, 'to index:', currIdx);

      // Remove the null placeholder left at prevIdx
      currList.splice(prevIdx, 1);
      // Insert the moved game at currIdx
      currList.splice(currIdx, 0, moved);
      // Ensure the list length remains the same by removing the last element
      currList.length = this.scheduledGames[fieldIdx].length;

      console.log('Final current list after reordering:', currList);
    } else if (event.previousContainer.id === 'unassignedGamesList') {
      // Assign from unassigned: place in the dropped slot if empty
      console.log('Assigning from unassigned games. event.previousContainer.id', event.previousContainer.id);
      const game = this.unassignedGames[event.previousIndex];

      console.log('Game being assigned:', game, 'to previousIndex:', event.previousIndex, 'to index:', slotIdx);
      if (currList[slotIdx] == null) {
        this.unassignedGames.splice(event.previousIndex, 1);
        currList[slotIdx] = game;
      }
    } else {
      // Move from another field: place in the dropped slot if empty
      console.log('Moving from another field or slot:', event.previousContainer.id, event.container.id);

      console.log('From:', event.previousContainer.id, event.previousContainer.data.fieldIdx, event.previousContainer.data.slotIdx);

      console.log('To:', event.container.id, event.container.data.fieldIdx, event.container.data.slotIdx);


      console.log('this.scheduledGames:', this.scheduledGames);
      console.log('From field index:', fromFieldIdx, 'From slot index:', fromSlotIdx);
      console.log('To field index:', fieldIdx, 'To slot index:', slotIdx);


      console.log('From slot:', this.scheduledGames[fromFieldIdx][fromSlotIdx]);
      console.log('To slot:', this.scheduledGames[fieldIdx][slotIdx]);

      const fromGame = this.scheduledGames[fromFieldIdx][fromSlotIdx];
      console.log('From game:', fromGame, 'at field:', fromFieldIdx, 'slot:', fromSlotIdx);
      const toGame = this.scheduledGames[fieldIdx][slotIdx];
      console.log('To game:', toGame, 'at field:', fieldIdx, 'slot:', slotIdx);

      // const prevList = event.previousContainer.data;
      // const game = prevList[fromSlotIdx];
      // console.log('Game being moved:', game, 'from field:', fromFieldIdx, 'from slot:', fromSlotIdx, 'to field:', fieldIdx, 'to slot:', slotIdx);

  
        this.scheduledGames[fromFieldIdx][fromSlotIdx] = toGame; // Clear the previous slot
        this.scheduledGames[fieldIdx][slotIdx] = fromGame; // Assign the game to the new slot

        console.log('Game moved successfully:', fromGame, 'to field:', fieldIdx, 'slot:', slotIdx);
  

      //  if (currList[slotIdx] == null) {
      // prevList[fromSlotIdx] = null;
      // currList[slotIdx] = game;



      //    this.scheduledGames[fromFieldIdx][fromSlotIdx] = null; // Clear the previous slot
      //   this.scheduledGames[fieldIdx][slotIdx] = game; // Assign the game to the new slot
      //   console.log('Game moved successfully:', game, 'to field:', fieldIdx, 'slot:', slotIdx);
      // }

      // const fromFieldIdx = this.scheduledGames.findIndex(list => list === prevList);
      // const draggables = this.getDraggableGames(fromFieldIdx);
      // const prevIdx = draggables[event.previousIndex].index;
      /* const game = prevList[prevIdx];
        if (currList[slotIdx] == null) {
          prevList[prevIdx] = null;
          currList[slotIdx] = game;
        }*/
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