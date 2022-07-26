import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from "../services/calendar.service";
import {WeekModel} from "../shared/week.model";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css'],
  providers: [CalendarService]
})
export class MonthViewComponent implements OnInit, OnDestroy {
  weeks: WeekModel[];
  monthChangedSubscription: Subscription;

  constructor(private calendarService: CalendarService,
              private logger: LogService) {
    logger.log('MonthViewComponent constructor');
  }

  ngOnDestroy(): void {
    this.logger.log('MonthViewComponent ngOnDestroy');
    this.monthChangedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.log('MonthViewComponent ngOnInit');
    // this.weeks = this.calendarService.getWeeks();
    this.monthChangedSubscription = this.calendarService.monthChanges$.subscribe(monthDt => {
      this.weeks = this.calendarService.getWeeks(monthDt)
    });
  }
}
