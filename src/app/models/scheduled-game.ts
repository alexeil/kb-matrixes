export class ScheduledGame {
  categoryName!: string;
  teams!: string[];
  originalCategoryIndex!: number;
  originalGameIndex!: number;
  referees: [string, string] = ['', ''];
  startTime!: Date ;
}
