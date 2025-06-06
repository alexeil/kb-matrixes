import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ScheduledGame } from '../../models/scheduled-game';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-game-sheet',
  standalone: true,
  templateUrl: './game-sheet.component.html',
  styleUrls: ['./game-sheet.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule
  ]
})
export class GameSheetComponent {
  @Input() catIndex!: number;
  @Input() fieldNumber!: number;
  @Input() games!: (ScheduledGame | null)[];
  @Input() numberOfSets!: number;

  teamLabels = ['Blue', 'Gray', 'Black'];



  @ViewChild('gameSheets') gameSheets!: ElementRef;

  printGameSheets() {
    const element = this.gameSheets.nativeElement;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Convert canvas size from px to pt (1pt = 1.333px at 96dpi)
      const pxToPt = 72 / 96;
      const canvasWidthPt = canvas.width * pxToPt;
      const canvasHeightPt = canvas.height * pxToPt;

      // Scale to fit within PDF page (keep aspect ratio)
      let imgWidth = canvasWidthPt;
      let imgHeight = canvasHeightPt;
      const widthScale = pdfWidth / imgWidth;
      const heightScale = pdfHeight / imgHeight;
      const scale = Math.min(widthScale, heightScale, 1); // Don't upscale

      imgWidth *= scale;
      imgHeight *= scale;

      // Center the image on the portrait page
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('printGameSheets.pdf');
    });
  }
}