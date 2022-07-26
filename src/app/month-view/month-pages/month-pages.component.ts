import {Component, OnInit} from '@angular/core';
import {DateTime} from "luxon";
import {CalendarService} from "../../services/calendar.service";
import {LogService} from "../../services/log.service";

@Component({
  selector: 'app-month-pages',
  templateUrl: './month-pages.component.html',
  styleUrls: ['./month-pages.component.css']
})
export class MonthPagesComponent implements OnInit {
  currentMonth!: DateTime;

  constructor(private calendarService: CalendarService,
              private logger: LogService) {
    logger.log('MonthPagesComponent constructor');
  }

  ngOnInit(): void {
    this.logger.log('MonthPagesComponent ngOnInit');
    this.setCurrentMonth()
  }

  setCurrentMonth() {
    this.currentMonth = DateTime.now();
    this.calendarService.monthChanges$.next(this.currentMonth)
  }

  setPrevMonth() {
    this.currentMonth = this.currentMonth.minus({month: 1});
    this.calendarService.monthChanges$.next(this.currentMonth)
  }

  setNextMonth() {
    this.currentMonth = this.currentMonth.plus({month: 1});
    this.calendarService.monthChanges$.next(this.currentMonth)
  }
}
