import {Injectable} from '@angular/core';
import {BehaviorSubject, concatAll, from, map, mergeMap, Observable, of, ReplaySubject, Subject, Subscription} from "rxjs";
import {LogService} from "./log.service";
import {AnyEvent, BaseEvent, DurationEvent, OccurrenceEvent} from "../shared/events.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DateTime} from "luxon";
import {EventOfDayModel} from "../event-of-day/event-of-day.model";
import {filter, tap} from "rxjs/operators";
import {GetEventsData} from "../shared/get-events-data.model";

export const DATE_FORMAT = 'yyyy-MM-dd'

@Injectable({providedIn: 'root'})
export class HrimEventService {
  url = `${environment.apiUrl}/v1/event/`;
  // TODO: extract to entityService
  entityUrl = `${environment.apiUrl}/v1/entity/`;
  events$ = new Subject<EventOfDayModel<AnyEvent>>()
  loadEventSubs: { [period: string]: Subscription } = {}

  constructor(private logger: LogService,
              private http: HttpClient) {
    logger.logConstructor(this);
  }

  load(start: DateTime, end: DateTime): void {
    const params = new HttpParams().set('start', start.toFormat(DATE_FORMAT))
                                   .set('end', end.toFormat(DATE_FORMAT))
    const period = `${start}-${end}`;
    if (this.loadEventSubs.hasOwnProperty(period)) {
      this.loadEventSubs[period].unsubscribe()
    }
    const options = {params, withCredentials: true}
    const observable = this.http
                           .get<GetEventsData>(this.url, options)
                           .pipe(
                             filter(e => !!e),
                             tap(data => this.logger.debug('Events loaded from server: ', data)),
                             mergeMap(data => of(...data.occurrences, ...data.durations)),
                             map(baseEvent => this.mapToEventOfDay(baseEvent)),
                             concatAll(),
                             tap(x => this.logger.debug('after mapping: ' + x.id + ' ' + x.date.toISODate(), x))
                           );
    const sub: Subscription = observable.subscribe({
      next: event => {
        this.events$.next(event)
      },
      error: () => sub.unsubscribe(),
      complete: () => sub.unsubscribe()
    });
    this.loadEventSubs[period] = sub
  }

  saveEvent(entity: BaseEvent): Observable<AnyEvent> {
    const options = {withCredentials: true};
    const url = (entity as DurationEvent).started_at
                ? this.url + 'duration/'
                : this.url + 'occurrence/';
    this.logger.debug(`saving event url: ${url}`, entity)
    return entity.id
           ? this.http.put<AnyEvent>(url, entity, options)
           : this.http.post<AnyEvent>(url, entity, options);
  }

  mapToEventOfDay(baseEvent: BaseEvent): Observable<EventOfDayModel<AnyEvent>> {
    const occurrenceEvent = baseEvent as OccurrenceEvent
    if (occurrenceEvent.occurred_at) {
      return of(new EventOfDayModel<OccurrenceEvent>(occurrenceEvent, DateTime.fromISO(occurrenceEvent.occurred_at)));
    }
    const durationEvent = baseEvent as DurationEvent
    if (durationEvent.started_at) {
      const started_at = DateTime.fromISO(durationEvent.started_at)
      const finished_at = durationEvent.finished_at && DateTime.fromISO(durationEvent.finished_at)

      const events: EventOfDayModel<AnyEvent>[] = []
      let i = 0;
      let nextDay: DateTime
      do {
        nextDay = finished_at
                  ? finished_at.minus({days: i++})
                  : started_at
        events.push(new EventOfDayModel<DurationEvent>(durationEvent, nextDay))
      } while (nextDay.diff(started_at, ['days']).days > 1)
      return from(events);
    }
    this.logger.error(`Unsupported type of event: '${baseEvent.constructor.name}'`, baseEvent)
    throw new Error('Unsupported type of event_analytics event')
  }
}
