import { Component, inject, OnInit } from '@angular/core';
import { CategoryStateService } from './services/category-state.service';
import { ScheduleStateService } from './services/schedule-state.service';
import { ScheduleConfigService } from './services/schedule-config.service';
import { Category } from './models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TeamInputComponent } from './components/team-input/team-input.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { GameSheetComponent } from './components/game-sheet/game-sheet.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { Observable } from 'rxjs';
import { ScheduledGame } from './models/scheduled-game';
import { ScheduleDisplay } from './components/schedule-display/schedule-display';
import { HeaderComponent } from './components/header/header.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { atobUnicode } from './utils/url-utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    DragDropModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    TeamInputComponent,
    MatrixComponent,
    GameSheetComponent,
    RankingComponent,
    ScheduleComponent,
    ScheduleDisplay,
    HeaderComponent,
    TournamentDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryIndex = 0;
  mainTabIndex = 0;

  lang: 'en' | 'cz' = 'en';
  teamLabels = ['M', 'B', 'Č'];
  tournamentLocation = '';

  scheduledGames$!: Observable<(ScheduledGame | null)[][]>;

  catState = inject(CategoryStateService);
  scheduleState = inject(ScheduleStateService);
  scheduleConfig = inject(ScheduleConfigService);

  ngOnInit() {
    this.scheduledGames$ = this.scheduleState.scheduledGames$;
    let previousLength = 0;
    this.catState.categories$.subscribe(cats => {
      // If a category was added, select the last one
      if (cats.length > previousLength) {
        this.selectedCategoryIndex = cats.length - 1;
      }
      // Ensure selectedCategoryIndex is valid
      if (this.selectedCategoryIndex >= cats.length) {
        this.selectedCategoryIndex = Math.max(0, cats.length - 1);
      }
      this.categories = cats;
      previousLength = cats.length;
    });

    // Auto-load shared config from URL on page load
    const params = new URLSearchParams(window.location.search);
    const share = params.get('share');
    if (share) {
      try {
        const decoded = atobUnicode(share);
        const state = JSON.parse(decoded);

        console.log('Loading setup from shared URL:', state);
        this.categories = state.categories;
        this.catState.setCategories(state.categories); // Ensure service is updated for all components
        // Restore schedule config state if present
        if (state.scheduleStart) this.scheduleConfig.setScheduleStart(state.scheduleStart);
        if (state.scheduleEnd) this.scheduleConfig.setScheduleEnd(state.scheduleEnd);
        if (state.scheduleInterval) this.scheduleConfig.setScheduleInterval(state.scheduleInterval);
        if (state.scheduleFields) this.scheduleConfig.setFields(state.scheduleFields);
        // Restore schedule state if present
        if (state.scheduledGames) this.scheduleState.setScheduledGames(state.scheduledGames);
        if (state.unassignedGames) this.scheduleState.setUnassignedGames(state.unassignedGames);

        console.log('Setup loaded from shared URL!');
      } catch {
        console.error('Failed to load from shared URL.');
      }
    }
  }

  get selectedCategory() {
    console.log('Selected category index:', this.selectedCategoryIndex);
    return this.categories[this.selectedCategoryIndex];
  }

  onTeamsChange(newTeams: string[], catIndex: number) {
    const cat = this.categories[catIndex];
    if (JSON.stringify(cat.teams) !== JSON.stringify(newTeams)) {
      this.catState.updateCategory(catIndex, { ...cat, teams: [...newTeams] });
    }
  }

  onDisplayMatrixChange(matrix: (string | number)[][], catIndex: number) {
    const cat = this.categories[catIndex];
    if (JSON.stringify(cat.displayMatrix) !== JSON.stringify(matrix)) {
      this.catState.updateCategory(catIndex, { ...cat, displayMatrix: [...matrix] });
    }
  }

  addCategory() {
    this.catState.addCategory();
  }

  removeCategory(index: number) {
    this.catState.removeCategory(index);
  }

  trackByCategoryId(index: number, cat: Category) {
    return cat.id;
  }

  onCategoryChange(index: number) {
    this.selectedCategoryIndex = index;
  }

  onCategoryNameChange(newName: string, catIndex: number) {
    const cat = this.categories[catIndex];
    if (cat.name !== newName) {
      this.catState.updateCategory(catIndex, { ...cat, name: newName });
    }
  }

  onNumberOfFieldsChange(newFields: number, catIndex: number) {
    const cat = this.categories[catIndex];
    if (cat.numberOfFields !== newFields) {
      this.catState.updateCategory(catIndex, { ...cat, numberOfFields: newFields });
    }
  }

  onTabChange(event: { index: number }) {
    this.selectedCategoryIndex = event.index;
  }
}
