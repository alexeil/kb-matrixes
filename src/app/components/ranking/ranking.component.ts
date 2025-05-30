import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CategoryStateService } from '../../services/category-state.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.sass'
})
export class RankingComponent implements OnInit, OnDestroy {
  @Input() lang: string = 'en';
  @Input() catIndex!: number;

  @ViewChild('rankingTable') rankingTable!: ElementRef;

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

  printRanking() {
    const element = this.rankingTable.nativeElement;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Use canvas width/height in pixels, convert to points (1pt = 1.333px at 96dpi)
      const pxToPt = 72 / 96;
      const canvasWidthPt = canvas.width * pxToPt;
      const canvasHeightPt = canvas.height * pxToPt;

      // Scale to fit within 90% of PDF width
      const maxImgWidth = pdfWidth * 0.9;
      const imgWidth = Math.min(maxImgWidth, canvasWidthPt);
      const imgHeight = (canvasHeightPt * imgWidth) / canvasWidthPt;

      // Center the image
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('ranking.pdf');
    });
  }
}