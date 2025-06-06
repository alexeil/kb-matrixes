import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CategoryStateService } from '../../services/category-state.service';
import { ScheduleStateService } from '../../services/schedule-state.service';
import { ScheduleConfigService } from '../../services/schedule-config.service';
import { Category } from '../../models/category';
import { ScheduledGame } from '../../models/scheduled-game';
import { combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-schedule',
  standalone: true,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule
  ],
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  categories!: Category[];
  scheduleStart!: Date;
  scheduleInterval!: number;
  fields!: number;
  scheduledGames!: (ScheduledGame | null)[][];
  unassignedGames!: ScheduledGame[];

  dragOverIndex: number | null = null;
  initialized = false;

  @ViewChildren('slotDropList') slotDropLists!: QueryList<CdkDropList>;

  constructor(
    private cdr: ChangeDetectorRef,
    private catState: CategoryStateService,
    private scheduleState: ScheduleStateService,
    private scheduleConfig: ScheduleConfigService
  ) { }

  ngOnInit() {

    combineLatest([
      this.scheduleConfig.scheduleStart$,
      this.scheduleConfig.scheduleInterval$,
      this.scheduleConfig.fields$,

      this.catState.categories$,

      this.scheduleState.scheduledGames$,
      this.scheduleState.unassignedGames$

    ]).subscribe(([scheduleStart, scheduleInter, fields, categories, scheduledGames, unassignedGames]) => {
      this.scheduleStart = scheduleStart;
      this.scheduleInterval = scheduleInter;

      if (!this.initialized) {
        console.log('Initializing schedule component with fields:', fields, 'and categories:', categories.length);
        this.categories = categories;
        this.fields = fields;
        this.initSchedule();
        if (scheduledGames.length != 0 || unassignedGames.length != 0) {
          this.scheduledGames = scheduledGames.map(arr => [...arr]);
          this.unassignedGames = [...unassignedGames];
        }
        this.initialized = true;
      } else {
        if (this.categoriesAreDifferent(this.categories, categories) || this.fields != fields) {
          this.categories = categories;
          this.fields = fields;
          this.initSchedule();
        }
      }
    });
  }

  private categoriesAreDifferent(a: Category[], b: Category[]): boolean {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  ngAfterViewInit() {
    // Needed for [cdkDropListConnectedTo]
  }


  initSchedule() {
    console.log('Initializing schedule with fields:', this.fields, 'and categories:', this.categories.length);
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

  flattenGames(): ScheduledGame[] {
    const games: ScheduledGame[] = [];
    this.categories.forEach((cat, catIdx) => {
      (cat.displayMatrix || []).forEach((row, gameIdx) => {
        games.push({
          categoryName: cat.name,
          teams: [String(row[1]), String(row[2]), String(row[3])],
          originalCategoryIndex: catIdx,
          originalGameIndex: gameIdx,
          referees: ['', '']
        });
      });
    });
    return games;
  }

  getTimeForIndex(index: number): string {
    const hours = this.scheduleStart.getHours();
    const minutes = this.scheduleStart.getMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
    this.scheduleState.setScheduledGames(this.scheduledGames);
    this.scheduleState.setUnassignedGames(this.unassignedGames);
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
    this.scheduleState.setScheduledGames(this.scheduledGames);
    this.scheduleState.setUnassignedGames(this.unassignedGames);
    this.cdr.detectChanges();
  }

  /**
   * Assign all games to fields in a generic way:
   * - If number of categories equals fields, assign each category to a field.
   * - If more categories than fields, distribute categories round-robin to fields.
   * - If more fields than categories, assign categories to fields in order, then fill remaining fields round-robin.
   * - If only one field, assign all games in order.
   */
  assignAllGames() {
    // Clear all scheduled games
    this.scheduledGames = this.scheduledGames.map(field => field.map(() => null));
    const allGames = this.flattenGames();
    const numFields = this.fields;
    const numCategories = this.categories.length;

    // Group games by category
    const gamesByCategory: ScheduledGame[][] = Array(numCategories).fill(null).map(() => []);
    allGames.forEach(game => {
      gamesByCategory[game.originalCategoryIndex].push(game);
    });

    // Prepare assignment
    const fieldAssignments: ScheduledGame[][] = Array(numFields).fill(null).map(() => []);
    if (numFields === 1) {
      // All games in order
      fieldAssignments[0] = allGames.slice();
    } else if (numFields === numCategories) {
      // Each category to a field
      for (let i = 0; i < numFields; i++) {
        fieldAssignments[i] = gamesByCategory[i] ? gamesByCategory[i].slice() : [];
      }
    } else if (numCategories > numFields) {
      // More categories than fields: distribute categories round-robin
      let fieldIdx = 0;
      for (let catIdx = 0; catIdx < numCategories; catIdx++) {
        for (const game of gamesByCategory[catIdx]) {
          fieldAssignments[fieldIdx].push(game);
        }
        fieldIdx = (fieldIdx + 1) % numFields;
      }
    } else {
      // More fields than categories: assign categories to fields in order, then fill remaining fields round-robin
      let catIdx = 0;
      for (let fieldIdx = 0; fieldIdx < numFields; fieldIdx++) {
        if (catIdx < numCategories) {
          fieldAssignments[fieldIdx] = gamesByCategory[catIdx].slice();
        }
        catIdx++;
      }
      // If there are still unassigned games (e.g. not enough categories), fill remaining fields round-robin
      const assignedGames = fieldAssignments.flat();
      const unassigned = allGames.filter(g => !assignedGames.includes(g));
      let idx = 0;
      for (const game of unassigned) {
        fieldAssignments[idx % numFields].push(game);
        idx++;
      }
    }
    // Assign to scheduledGames and clear unassignedGames
    for (let fieldIdx = 0; fieldIdx < numFields; fieldIdx++) {
      for (let slotIdx = 0; slotIdx < fieldAssignments[fieldIdx].length; slotIdx++) {
        this.scheduledGames[fieldIdx][slotIdx] = fieldAssignments[fieldIdx][slotIdx];
      }
    }
    this.unassignedGames = [];
    this.cdr.detectChanges();
    this.scheduleState.setScheduledGames(this.scheduledGames);
    this.scheduleState.setUnassignedGames(this.unassignedGames);
  }
}