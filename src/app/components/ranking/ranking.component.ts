import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CategoryStateService } from '../../services/category-state.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ScheduleConfigService } from '../../services/schedule-config.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-ranking',
  standalone: true,
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule
  ]
})
export class RankingComponent implements OnInit, OnDestroy {
  @Input() lang = 'en';
  @Input() catIndex!: number;

  @ViewChild('rankingTable') rankingTable!: ElementRef;

  teams: string[] = [];
  categoryName = '';
  date = '';
  location = '';
  private sub!: Subscription;

  constructor(private catState: CategoryStateService, private scheduleConfig: ScheduleConfigService) { }

  ngOnInit() {
    this.sub = this.catState.categories$.subscribe(categories => {
      const cat = categories[this.catIndex];
      this.teams = cat ? cat.teams : [];
      this.categoryName = cat ? cat.name : '';
    });
    this.sub = this.scheduleConfig.scheduleDate$.subscribe(scheduleDate => {
      this.date = scheduleDate;
    });
    this.sub = this.scheduleConfig.location$.subscribe(location => {
      this.location = location;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  printRanking() {
    if (!this.rankingTable || !this.rankingTable.nativeElement) {
      throw new TypeError('rankingTable is not available');
    }
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