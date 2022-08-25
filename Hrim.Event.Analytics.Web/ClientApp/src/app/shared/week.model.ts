import {DayModel} from "./day.model";

export class WeekModel {
  public weekOfYear: number;
  public days: DayModel[];

  constructor(weekOfYear: number) {
    this.weekOfYear = weekOfYear;
    this.days = [];
  }
}
