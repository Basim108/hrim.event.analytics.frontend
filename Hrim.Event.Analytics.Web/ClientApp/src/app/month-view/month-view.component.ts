import {Component, OnDestroy, OnInit} from '@angular/core'
import {CalendarService} from '../services/calendar.service'
import {WeekModel} from '../shared/week.model'
import {Subscription} from 'rxjs'
import {ActivatedRoute, Params, Router} from '@angular/router'
import {RouteService} from '../services/route.service'
import {DateTime} from 'luxon'
import {LogService} from '../services/log.service'

@Component({
  selector:    'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls:   ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit, OnDestroy {
  weeks: WeekModel[]
  currentMonth: DateTime
  routeParamsSub: Subscription

  constructor(private calendarService: CalendarService,
              private currentRoute: ActivatedRoute,
              private router: Router,
              private routeService: RouteService,
              private logger: LogService) {
    logger.logConstructor(this)
  }

  ngOnDestroy(): void {
    this.routeParamsSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.routeParamsSub = this.currentRoute.params.subscribe(
      {
        next:  async (params: Params) => {
          const date = this.routeService.monthView.getDateFromParams(params)
          this.logger.debug('date from route params: ', date)
          if (date) {
            this.routeService.monthView.lastSuccessfulDate = date
            this.weeks                                     = this.calendarService.getWeeks(date)
            this.currentMonth                              = date
          }
          else {
            await this.router.navigate([this.routeService.notFoundPath])
          }
        },
        error: this.logger.error
      })
  }
}
