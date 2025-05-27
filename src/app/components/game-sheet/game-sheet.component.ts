import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-sheet',
  templateUrl: './game-sheet.component.html',
  styleUrls: ['./game-sheet.component.sass']
})
export class GameSheetComponent {
  @Input() teams: string[] = [];
  @Input() matchMatrix: (string | number)[][] = []

  teamLabels = ['Blue', 'Gray', 'Black'];
}