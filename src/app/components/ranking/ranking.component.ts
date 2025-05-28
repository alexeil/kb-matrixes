import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CategoryStateService } from '../../services/category-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.sass'
})
export class RankingComponent implements OnInit, OnDestroy {
  @Input() lang: string = 'en';
  @Input() catIndex!: number;

  teams: string[] = [];
  private sub!: Subscription;

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

  constructor(private catState: CategoryStateService) { }

  ngOnInit() {
    this.sub = this.catState.categories$.subscribe(categories => {
      const cat = categories[this.catIndex];
      this.teams = cat ? cat.teams : [];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}