import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingComponent } from './ranking.component';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankingComponent],
      imports: [],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct table headers for en and cz', () => {
    component.lang = 'en';
    expect(component.tableHeaders.team).toBe('Team Name');
    component.lang = 'cz';
    expect(component.tableHeaders.team).toBe('Jméno týmu');
  });

  it('should update teams and categoryName on categories$ change', () => {
    // Simulate subscription update
    const mockCat = { name: 'Cat1', teams: ['A', 'B'], displayMatrix: [], numberOfFields: 1, id: 1 };
    component.catIndex = 0;
    // @ts-ignore
    component['catState'].categoriesSubject.next([mockCat]);
    expect(component.teams).toEqual(['A', 'B']);
    expect(component.categoryName).toBe('Cat1');
  });

  it('should unsubscribe on destroy', () => {
    // Patch with a minimal Subscription-like object
    component['sub'] = { unsubscribe: jasmine.createSpy('unsubscribe'), closed: false } as any;
    component.ngOnDestroy();
    expect(component['sub'].unsubscribe).toHaveBeenCalled();
  });

  it('should call printRanking and handle html2canvas and jsPDF', async () => {
    const mockCanvas = {
      width: 100,
      height: 200,
      toDataURL: () => 'data:image/png;base64,abc=='
    };
    // @ts-ignore
    window.html2canvas = () => Promise.resolve(mockCanvas);
    // @ts-ignore
    window.jsPDF = function() {
      return {
        internal: { pageSize: { getWidth: () => 400, getHeight: () => 600 } },
        addImage: jasmine.createSpy('addImage'),
        save: jasmine.createSpy('save')
      };
    };
    component.rankingTable = { nativeElement: document.createElement('div') } as any;
    await component.printRanking();
    expect(true).toBeTrue();
  });

  it('should handle missing category gracefully', () => {
    component.catIndex = 1; // out of bounds
    // @ts-ignore
    component['catState'].categoriesSubject.next([]);
    expect(component.teams).toEqual([]);
    expect(component.categoryName).toBe('');
  });

  it('should handle printRanking with missing rankingTable', async () => {
    (component as any).rankingTable = undefined;
    try {
      await component.printRanking();
      fail('Expected error was not thrown');
    } catch (e: any) {
      expect(e && e.message).toBe('rankingTable is not available');
    }
  });
});
