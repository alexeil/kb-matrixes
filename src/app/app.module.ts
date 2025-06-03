import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TeamInputComponent } from './components/team-input/team-input.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { GameSheetComponent } from './components/game-sheet/game-sheet.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
import {MatTimepickerModule} from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    imports: [
        BrowserModule,
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
        // Standalone components only in imports
        AppComponent,
        TeamInputComponent,
        MatrixComponent,
        GameSheetComponent,
        RankingComponent,
        ScheduleComponent
    ],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }