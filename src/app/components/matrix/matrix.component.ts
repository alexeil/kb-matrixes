import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})
export class MatrixComponent implements OnChanges {
  @Input() teams: string[] = ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'];
  @Output() displayMatrixChange = new EventEmitter<(string | number)[][]>();
  displayMatrix: (string | number)[][] = [];

  // Hardcoded matrix as per your example (team numbers, 1-based)
  public readonly matchMatrix = [
    [1, 2, 3],
    [1, 4, 5],
    [4, 2, 3],
    [1, 2, 5],
    [4, 5, 3]
  ];

  ngOnChanges() {
    console.log("before change" + this.displayMatrix);
    this.generateDisplayMatrix();
    this.displayMatrixChange.emit(this.displayMatrix);
    console.log("After change" + this.displayMatrix);
  }

  generateDisplayMatrix() {
    // Only generate if we have exactly 5 teams
    if (this.teams.length !== 5) {
      this.displayMatrix = [];
      return;
    }

    // Map team numbers to names (team numbers are 1-based)
    this.displayMatrix = this.matchMatrix.map((row, i) => [
      i + 1, // Match number
      ...row.map(teamNum => this.teams[teamNum - 1])
    ]);
  }
}