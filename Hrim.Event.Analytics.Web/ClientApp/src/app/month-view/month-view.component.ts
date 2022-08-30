import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from "../services/calendar.service";
import {WeekModel} from "../shared/week.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RouteService} from "../services/route.service";
import {DateTime} from "luxon";
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css'],
  providers: [CalendarService]
})
export class MonthViewComponent implements OnInit, OnDestroy {
  weeks: WeekModel[];
  currentMonth: DateTime;
  routeParamsSubscription: Subscription;

  constructor(private calendarService: CalendarService,
              private currentRoute: ActivatedRoute,
              private router: Router,
              private routeService: RouteService,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnDestroy(): void {
    this.logger.debug('MonthViewComponent ngOnDestroy');
    this.routeParamsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('MonthViewComponent ngOnInit');
    this.routeParamsSubscription = this.currentRoute.params.subscribe(
      (params: Params) => {
        const date = this.routeService.monthView.getDateFromParams(params);
        this.logger.debug('date from route params: ', date);
        if (date) {
          this.routeService.monthView.lastSuccessfulDate = date;
          this.weeks = this.calendarService.getWeeks(date);
          this.currentMonth = date;
        } else {
          this.router.navigate([this.routeService.notFoundPath]);
        }
      });
  }
}
