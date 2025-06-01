import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScheduledGame } from '../models/scheduled-game';

@Injectable({ providedIn: 'root' })
export class ScheduleStateService {
  private scheduledGamesSubject = new BehaviorSubject<(ScheduledGame | null)[][]>([]);
  private unassignedGamesSubject = new BehaviorSubject<ScheduledGame[]>([]);

  scheduledGames$ = this.scheduledGamesSubject.asObservable();
  unassignedGames$ = this.unassignedGamesSubject.asObservable();

  get scheduledGames() {
    return this.scheduledGamesSubject.value;
  }
  get unassignedGames() {
    return this.unassignedGamesSubject.value;
  }

  setScheduledGames(games: (ScheduledGame | null)[][]) {
    this.scheduledGamesSubject.next(games.map(arr => [...arr]));
  }
  setUnassignedGames(games: ScheduledGame[]) {
    this.unassignedGamesSubject.next([...games]);
  }

  reset() {
    this.scheduledGamesSubject.next([]);
    this.unassignedGamesSubject.next([]);
  }
}
