import {Injectable} from '@angular/core';
import {MonthViewRouteModel} from "../shared/month-view-route.model";
import {YearViewRouteModel} from "../shared/year-view-route.model";
import {Router} from "@angular/router";
import {DateTime} from "luxon";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  monthView = new MonthViewRouteModel();
  yearView = new YearViewRouteModel();
  notFoundPath = '404';

  constructor(private router: Router) {
  }

  navigateToLastSuccessfulMonth() {
    console.debug('start handling navigateToLastSuccessfulMonth');
    console.debug('lastSuccessfulDate: ', this.monthView.lastSuccessfulDate)
    this.navigateToMonthView(this.monthView.lastSuccessfulDate || DateTime.now());
  }

  navigateToMonthView(date: DateTime) {
    const dateParam = date.toFormat(this.monthView.format)
    console.debug('navigate to month view: ', dateParam, date);
    this.router.navigate([this.monthView.path, dateParam]);
  }
}
