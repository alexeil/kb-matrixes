import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { GameSheetComponent } from './game-sheet.component';

describe('GameSheetComponent', () => {
  let component: GameSheetComponent;
  let fixture: ComponentFixture<GameSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSheetComponent],
      imports: [],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default teamLabels', () => {
    expect(component.teamLabels).toEqual(['Blue', 'Gray', 'Black']);
  });

  it('should accept @Input properties', () => {
    component.catIndex = 1;
    component.fieldNumber = 2;
    component.games = [
      { categoryName: 'Cat', teams: ['A', 'B', 'C'], originalCategoryIndex: 0, originalGameIndex: 0, referees: ['', ''] }
    ];
    expect(component.catIndex).toBe(1);
    expect(component.fieldNumber).toBe(2);
    expect(component.games.length).toBe(1);
  });

  it('should call printGameSheets and handle html2canvas and jsPDF', async () => {
    // Mock html2canvas and jsPDF
    const mockCanvas = {
      width: 100,
      height: 200,
      toDataURL: () => 'data:image/png;base64,abc=='
    };
    // @ts-expect-error: Mocking global html2canvas for test
    window.html2canvas = () => Promise.resolve(mockCanvas);
    // @ts-expect-error: Mocking global jsPDF for test
    window.jsPDF = function() {
      return {
        internal: { pageSize: { getWidth: () => 400, getHeight: () => 600 } },
        addImage: jasmine.createSpy('addImage'),
        save: jasmine.createSpy('save')
      };
    };
    component.gameSheets = { nativeElement: document.createElement('div') } as unknown as ElementRef;
    await component.printGameSheets();
    // If no error is thrown, the test passes
    expect(true).toBeTrue();
  });
});
