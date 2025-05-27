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

@NgModule({
    declarations: [
        AppComponent,
        TeamInputComponent,
        MatrixComponent,
        GameSheetComponent,
        RankingComponent,
        ScheduleComponent
    ],
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
        MatTableModule
    ],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }