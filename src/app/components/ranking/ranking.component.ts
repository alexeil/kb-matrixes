import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.sass'
})
export class RankingComponent {
  @Input() lang: string = 'en';
  @Input() teams: string[] = [];

  get tableHeaders() {
    return this.lang === 'cz'
      ? {
        team: 'Jméno týmu',
        matches: 'Zápasy',
        sets: 'Sety',
        fairplay: 'Fairplay',
        total: 'Celkem',
        totalMatches: 'Zápasy celkem',
        rank: 'Pořadí',
        match: 'Zápas'
      }
      : {
        team: 'Team Name',
        matches: 'Matches',
        sets: 'Sets',
        fairplay: 'Fairplay',
        total: 'Total',
        totalMatches: 'Total Matches',
        rank: 'Rank',
        match: 'Match'
      };
  }
}
