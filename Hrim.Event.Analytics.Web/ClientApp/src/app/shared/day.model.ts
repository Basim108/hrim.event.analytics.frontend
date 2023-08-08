import {DateTime} from "luxon";

export class DayModel {
  public day: number;
  public month: number;
  public year: number;
  public isToday: boolean;

  constructor(public dateTime: DateTime) {
    this.day = dateTime.day;
    this.month = dateTime.month;
    this.year = dateTime.year;
    this.isToday = DateTime.now().toISODate() === dateTime.toISODate();
  }
}
