import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CategoryStateService } from '../../services/category-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-sheet',
  templateUrl: './game-sheet.component.html',
  styleUrls: ['./game-sheet.component.sass']
})
export class GameSheetComponent implements OnInit, OnDestroy {
  @Input() catIndex!: number;

  matchMatrix: (string | number)[][] = [];
  teams: string[] = [];
  teamLabels = ['Blue', 'Gray', 'Black'];

  private sub!: Subscription;

  constructor(private catState: CategoryStateService) {}

  ngOnInit() {
    this.sub = this.catState.categories$.subscribe(categories => {
      const cat = categories[this.catIndex];
      if (cat) {
        this.matchMatrix = cat.displayMatrix;
        this.teams = cat.teams;
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}