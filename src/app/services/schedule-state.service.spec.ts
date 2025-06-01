import { TestBed } from '@angular/core/testing';
import { ScheduleStateService } from './schedule-state.service';
import { ScheduledGame } from '../models/scheduled-game';

describe('ScheduleStateService', () => {
  let service: ScheduleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get scheduled games', () => {
    const games: (ScheduledGame | null)[][] = [
      [
        { categoryName: 'Cat1', teams: ['A', 'B', 'C'], originalCategoryIndex: 0, originalGameIndex: 0 },
        null
      ]
    ];
    service.setScheduledGames(games);
    expect(service.scheduledGames.length).toBe(1);
    expect(service.scheduledGames[0][0]?.categoryName).toBe('Cat1');
    expect(service.scheduledGames[0][1]).toBeNull();
  });

  it('should set and get unassigned games', () => {
    const games = [
      { categoryName: 'Cat2', teams: ['X', 'Y', 'Z'], originalCategoryIndex: 1, originalGameIndex: 2 }
    ];
    service.setUnassignedGames(games);
    expect(service.unassignedGames.length).toBe(1);
    expect(service.unassignedGames[0].categoryName).toBe('Cat2');
  });

  it('should reset scheduled and unassigned games', () => {
    service.setScheduledGames([[null]]);
    service.setUnassignedGames([
      { categoryName: 'Cat3', teams: ['Q', 'W', 'E'], originalCategoryIndex: 2, originalGameIndex: 1 }
    ]);
    service.reset();
    expect(service.scheduledGames).toEqual([]);
    expect(service.unassignedGames).toEqual([]);
  });
});
