import {DateTime} from "luxon";
import {WeekModel} from "../shared/week.model";
import {DayModel} from "../shared/day.model";
import {BehaviorSubject} from "rxjs";
import {LogService} from "./log.service";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private weeksByMonth: { [name: string]: WeekModel[] } = {};
  monthChanges$ = new BehaviorSubject<DateTime>(DateTime.now());

  constructor(private logger: LogService) {
    logger.log('CalendarService constructor');
  }

  getWeeks(date?: DateTime): WeekModel[] {
    const now = date || DateTime.now();
    const key = `${now.year}-${now.month}`;
    if (this.weeksByMonth.hasOwnProperty(key)) {
      return this.weeksByMonth[key];
    }
    const firstMonthDay = DateTime.fromObject({year: now.year, month: now.month, day: 1});
    const lastMonthDay = DateTime.fromObject({year: now.year, month: now.month, day: now.daysInMonth});
    const completeLastWeekDays = lastMonthDay.weekday < 7
      ? 7 - lastMonthDay.weekday
      : 6;
    const allReportDays = now.daysInMonth + firstMonthDay.weekday + completeLastWeekDays;
    const result = [];
    let weekIndex = firstMonthDay.weekYear;
    let firstReportDay = firstMonthDay.minus({days: firstMonthDay.weekday});
    for (let i = 0; i < allReportDays; i++) {
      if (i % 7 === 0) {
        result.push(new WeekModel(weekIndex++))
      }
      const date = firstReportDay.plus({days: i});
      const weekModel = result[result.length - 1];
      weekModel.days.push(new DayModel(date));
    }
    this.weeksByMonth[key] = result;
    return result;
  }
}
