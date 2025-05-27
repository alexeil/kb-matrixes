import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})
export class MatrixComponent implements OnChanges {
  @Input() teams: string[] = [];
  matrix: number[][] = [];

  ngOnChanges() {
    this.generateMatrix();
  }

  generateMatrix() {
    const n = this.teams.length;
    // Example: hardcoded matrix logic (e.g., 1 if i != j, 0 otherwise)
    this.matrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 0 : 1))
    );
  }
}