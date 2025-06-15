export class ScheduledGame {
  startTime!: Date;
  originalCategoryIndex!: number;
  originalGameIndex!: number;
  categoryName!: string;

  teams: string[] = [];
  referees: [string, string] = ['', ''];

  constructor(init?: Partial<ScheduledGame>) {
    Object.assign(this, init);
  }
}
