import {Component, Input} from '@angular/core';
import {DateTime} from "luxon";
import {RouteService} from "../../services/route.service";
import {LogService} from "../../services/log.service";

@Component({
  selector: 'app-month-pages',
  templateUrl: './month-pages.component.html'
})
export class MonthPagesComponent {
  @Input() currentMonth!: DateTime;

  constructor(private routeService: RouteService,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  setCurrentMonth() {
    this.currentMonth = DateTime.now();
    this.routeService.navigateToMonthView(this.currentMonth);
  }

  setPrevMonth() {
    this.currentMonth = this.currentMonth.minus({month: 1});
    this.routeService.navigateToMonthView(this.currentMonth);
  }

  setNextMonth() {
    this.currentMonth = this.currentMonth.plus({month: 1});
    this.routeService.navigateToMonthView(this.currentMonth);
  }
}
