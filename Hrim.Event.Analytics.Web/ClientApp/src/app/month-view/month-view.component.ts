import {Component, OnDestroy, OnInit}                  from '@angular/core'
import {CalendarService}                               from '../services/calendar.service'
import {WeekModel}                                     from '../shared/week.model'
import {filter, Subscription, take}                    from 'rxjs'
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router'
import {RouteService}                                  from '../services/route.service'
import {DateTime}                                      from 'luxon'
import {LogService}                                    from '../services/log.service'
import {HrimEventService}                              from '../services/hrim-event.service'
import {OccurrenceEventModel}                          from '../shared/occurrence-event.model'
import {DayModel}                                      from '../shared/day.model'
import {DurationEventModel}                            from '../shared/duration-event.model'
import {EventTypeService}                              from "../services/user-event-type.service";
import {BaseEventModel}                                from "../shared/base-event.model";
import {SomeEventModel}                                from "../shared/some-event.model";

@Component({
             selector   : 'app-month-view',
             templateUrl: './month-view.component.html',
             styleUrls  : ['./month-view.component.css']
           })
export class MonthViewComponent implements OnInit,
                                           OnDestroy {
  weeks: WeekModel[]
  currentMonth: DateTime
  occurrenceEvents: OccurrenceEventModel[] = []
  durationEvents: DurationEventModel[]     = []
  occurenceEventSub: Subscription
  durationEventSub: Subscription
  routeParamsSub: Subscription
  routeEventSub: Subscription

  constructor(private calendarService: CalendarService,
              private currentRoute: ActivatedRoute,
              private router: Router,
              private routeService: RouteService,
              private eventService: HrimEventService,
              private eventTypeService: EventTypeService,
              private logger: LogService) {
    logger.logConstructor(this)
  }

  ngOnDestroy(): void {
    this.logger.debug('month-view destroy')
    this.routeParamsSub?.unsubscribe()
    this.routeEventSub?.unsubscribe()
    this.occurenceEventSub?.unsubscribe()
    this.durationEventSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.logger.debug('month-view initialization')
    this.setupRouteChanges()
    this.eventTypeService.selectedTypesInfo$.next()
  }

  setupRouteChanges() {
    this.routeEventSub  = this.router
                              .events
                              .pipe(filter(routeEvent => routeEvent instanceof NavigationEnd))
                              .subscribe({
                                           next : () => this.onRouteParamChanged(this.currentRoute.snapshot.params),
                                           error: this.logger.error
                                         })
    this.routeParamsSub = this.currentRoute
                              .params
                              .pipe(take(1))
                              .subscribe({
                                           next : params => this.onRouteParamChanged(params),
                                           error: this.logger.error
                                         })
  }

  async onRouteParamChanged(params: Params) {
    const date = this.routeService.monthView.getDateFromParams(params)
    this.logger.debug('route params changed: ', params, this.currentRoute)

    if (date) {
      this.routeService
        .monthView
        .lastSuccessfulDate = date
      this.weeks            = this.calendarService.getWeeks(date)
      this.currentMonth     = date
      this.occurenceEventSub?.unsubscribe()
      this.durationEventSub?.unsubscribe()
      this.occurenceEventSub = this.eventService
                                   .loadMonthOccurrenceEvents(date)
                                   .subscribe({
                                                next : events => {
                                                  this.occurrenceEvents = events
                                                  setTimeout(() => this.eventTypeService.selectedTypesInfo$.next())
                                                },
                                                error: err => this.logger.error('month-view occurrence loading: ', err)
                                              })
      this.durationEventSub  = this.eventService
                                   .loadMonthDurationEvents(date)
                                   .subscribe({
                                                next : events => {
                                                  this.durationEvents = events
                                                  setTimeout(() => this.eventTypeService.selectedTypesInfo$.next())
                                                },
                                                error: err => this.logger.error('month-view duration loading: ', err)
                                              })
    } else {
      await this.router.navigate([this.routeService.notFoundPath])
    }
  }

  getOccurrences(day: DayModel): OccurrenceEventModel[] {
    const date = day.dateTime.toISODate()
    return this.occurrenceEvents.filter(x => x.occurredOn === date)
  }

  getDurations(day: DayModel): DurationEventModel[] {
    const date         = day.dateTime.toISODate()
    const resultEvents = this.durationEvents.filter(x => x.finishedOn
                                                         ? date >= x.startedOn && date <= x.finishedOn
                                                         : date === x.startedOn)
    // this.logger.debug(`filtering durations:  for day ${date}`, resultEvents, this.durationEvents)
    return resultEvents
  }

  onEventDeleted($event: SomeEventModel) {
    const prevOccurrences = this.occurrenceEvents
    const prevDurations = this.durationEvents
    if ($event instanceof OccurrenceEventModel) {
      this.occurrenceEvents = this.occurrenceEvents.filter(x => x.id !== $event.id)
    } else {
      this.durationEvents = this.durationEvents.filter(x => x.id !== $event.id)
    }
    this.logger.debug('month-view handle event deletion: ', {
      prevOccurrences,
      occurrences: this.occurrenceEvents,
      prevDurations,
      durations: this.durationEvents
    })
  }
}
