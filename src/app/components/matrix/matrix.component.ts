import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MATCH_MATRICES } from '../../utils/matrixes.data';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})

export class MatrixComponent implements OnChanges {
  @Input() teams: string[] = ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'];
  @Output() displayMatrixChange = new EventEmitter<(string | number)[][]>();
  displayMatrix: (string | number)[][] = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log('MatrixComponent changes:', changes);
    if (changes['teams']) {
      console.log('Teams changed in MatrixComponent:', this.teams);
      // Add your matrix generation logic here
      this.generateDisplayMatrix();
      this.displayMatrixChange.emit(this.displayMatrix);
    }
  }

  generateDisplayMatrix() {
    console.log("generateDisplayMatrix teams:" + this.teams);

    const matrix = MATCH_MATRICES[this.teams.length];
    console.log("generateDisplayMatrix  matrix:" + matrix);

    if (!matrix) {
      this.displayMatrix = [];
      return;
    }

    if (!matrix[1]) {
      console.error("Mismatch between teams and matrix length");
      this.displayMatrix = [];
      return;
    }

    this.displayMatrix = matrix[1].map((row, i) => [
      i + 1,
      ...row.map(teamNum => this.teams[teamNum - 1])
    ]);
  }
}