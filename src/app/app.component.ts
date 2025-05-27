import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  teams: string[] = ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'];
  lang: 'en' | 'cz' = 'en';
  teamLabels = ['M', 'B', 'Č'];
  displayMatrix: (string | number)[][] = [];

  onDisplayMatrixChange(matrix: (string | number)[][]) {
    this.displayMatrix = matrix;
    console.log("Display matrix updated:", this.displayMatrix);
  }
}