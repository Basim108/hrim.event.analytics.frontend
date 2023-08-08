import {Injectable} from '@angular/core';
import {MonthViewRouteModel} from "../shared/month-view-route.model";
import {YearViewRouteModel} from "../shared/year-view-route.model";
import {Router} from "@angular/router";
import {DateTime} from "luxon";
import {LogService} from "./log.service";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  monthView = new MonthViewRouteModel();
  yearView = new YearViewRouteModel();
  readonly notFoundPath = '404';

  constructor(private logger: LogService, private router: Router) {
    logger.logConstructor(this);
  }

  navigateToLastSuccessfulMonth() {
    this.logger.debug('start handling navigateToLastSuccessfulMonth');
    this.logger.debug('lastSuccessfulDate: ', this.monthView.lastSuccessfulDate)
    this.navigateToMonthView(this.monthView.lastSuccessfulDate || DateTime.now());
  }

  navigateToMonthView(date: DateTime) {
    const dateParam = date.toFormat(this.monthView.format)
    this.logger.debug('navigate to month view: ', dateParam, date, this.monthView);
    this.router.navigate(['/' + this.monthView.path, dateParam]);
  }
}
