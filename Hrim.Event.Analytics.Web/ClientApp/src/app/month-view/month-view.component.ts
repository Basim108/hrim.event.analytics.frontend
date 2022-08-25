import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from "../services/calendar.service";
import {WeekModel} from "../shared/week.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RouteService} from "../services/route.service";
import {DateTime} from "luxon";

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
              private routeService: RouteService) {
    console.debug('MonthViewComponent constructor');
  }

  ngOnDestroy(): void {
    console.debug('MonthViewComponent ngOnDestroy');
    this.routeParamsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    console.debug('MonthViewComponent ngOnInit');
    this.routeParamsSubscription = this.currentRoute.params.subscribe(
      (params: Params) => {
        const date = this.routeService.monthView.getDateFromParams(params);
        console.debug('date from route params: ', date);
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
