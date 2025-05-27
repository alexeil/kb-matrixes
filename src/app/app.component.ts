import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  teams: string[] = [];
  lang: 'en' | 'cz' = 'en';
  teamLabels = ['M', 'B', 'Č'];
  displayMatrix: (string | number)[][] = [];
  categoryName: string = '';
  scheduleStart: string = '10:00';
  scheduleInterval: number = 45; // minutes

  //ngOnInit() {
    // Generate the initial displayMatrix based on default teams
   // this.onDisplayMatrixChange(this.generateDisplayMatrix());
  //}

  generateDisplayMatrix(): (string | number)[][] {
    // Example hardcoded match matrix
    const matchMatrix = [
      [1, 2, 3],
      [1, 4, 5],
      [4, 2, 3],
      [1, 2, 5],
      [4, 5, 3]
    ];
    if (this.teams.length !== 5) return [];
    return matchMatrix.map((row, i) => [
      i + 1,
      ...row.map(teamNum => this.teams[teamNum - 1])
    ]);
  }

  onDisplayMatrixChange(matrix: (string | number)[][]) {
    this.displayMatrix = matrix;
  }

  onTeamsChange(newTeams: string[]) {
    this.teams = [...newTeams];
  }
}