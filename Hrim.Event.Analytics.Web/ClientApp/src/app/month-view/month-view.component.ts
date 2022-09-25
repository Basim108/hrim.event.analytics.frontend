import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from "../services/calendar.service";
import {WeekModel} from "../shared/week.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RouteService} from "../services/route.service";
import {DateTime} from "luxon";
import {LogService} from "../services/log.service";
import {HrimEventService} from "../services/hrim-event.service";
import {EventOfDayModel} from "../event-of-day/event-of-day.model";
import {AnyEvent} from "../shared/events.model";

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css'],
  providers: [CalendarService]
})
export class MonthViewComponent implements OnInit, OnDestroy {
  weeks: WeekModel[]
  currentMonth: DateTime
  routeParamsSub: Subscription
  eventsSub: Subscription

  constructor(private calendarService: CalendarService,
              private eventService: HrimEventService,
              private currentRoute: ActivatedRoute,
              private router: Router,
              private routeService: RouteService,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe()
    this.eventsSub.unsubscribe()
  }

  ngOnInit(): void {
    this.routeParamsSub = this.currentRoute.params.subscribe(
      (params: Params) => {
        const date = this.routeService.monthView.getDateFromParams(params);
        this.logger.debug('date from route params: ', date);
        if (date) {
          this.routeService.monthView.lastSuccessfulDate = date;
          this.weeks = this.calendarService.getWeeks(date);
          this.currentMonth = date;
          const firstMonthDay = DateTime.fromObject({year: date.year, month: date.month, day: 1});
          const lastMonthDay = DateTime.fromObject({year: date.year, month: date.month, day: date.daysInMonth});
          this.eventService.load(firstMonthDay, lastMonthDay);
        } else {
          this.router.navigate([this.routeService.notFoundPath]);
        }
      });
  }
}
