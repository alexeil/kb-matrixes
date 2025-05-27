import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TeamInputComponent } from './components/team-input/team-input.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { GameSheetComponent } from './components/game-sheet/game-sheet.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }