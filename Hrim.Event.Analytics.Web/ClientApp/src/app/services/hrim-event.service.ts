import {Injectable}                     from '@angular/core'
import {OccurrenceEventModel}           from '../shared/occurrence-event.model'
import {map, Observable, ReplaySubject} from 'rxjs'
import {LogService}                     from './log.service'
import {HttpClient, HttpParams}         from '@angular/common/http'
import {tap}                            from 'rxjs/operators'
import {environment}                    from '../../environments/environment'
import {DateTime}                       from 'luxon'
import EventsForPeriodResponseModel     from '../shared/events-for-period-response.model'
import {DurationEventModel}             from '../shared/duration-event.model'
import {SomeEventModel}                 from "../shared/some-event.model";
import {EntityState}                    from "../shared/entity-state";

@Injectable({providedIn: 'root'})
export class HrimEventService {
  occurrenceEvents$ = new ReplaySubject<OccurrenceEventModel>()
  occurrenceUrl     = `${environment.apiUrl}/v1/event/occurrence`
  durationUrl       = `${environment.apiUrl}/v1/event/duration`
  entityUrl         = `${environment.apiUrl}/v1/entity/`
  periodFormat      = 'yyyy-MM-d'

  eventContext: { [eventId: string]: EntityState<SomeEventModel> } = {}

  constructor(private logger: LogService,
              private http: HttpClient) {
    logger.logConstructor(this)
  }

  createEvent(model: OccurrenceEventModel): void {
    model.id = crypto.randomUUID()
    this.occurrenceEvents$.next(model)
  }

  registerEntityState(entity: SomeEventModel) {
    let eventContext = this.eventContext[entity.id]
    if (eventContext) {
      eventContext.entity = entity
    } else {
      eventContext                 = new EntityState<SomeEventModel>()
      eventContext.entity          = entity
      this.eventContext[entity.id] = eventContext
    }
  }

  loadMonthOccurrenceEvents(month: DateTime): Observable<OccurrenceEventModel[]> {
    const options = {
      params         : this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
               .get<EventsForPeriodResponseModel>(this.occurrenceUrl, options)
               .pipe(
                 tap(responseModel => this.logger.debug('occurence events loaded from the cloud:', responseModel)),
                 map(responseModel => responseModel.occurrences.map(x => {
                   const event = new OccurrenceEventModel(x)
                   this.registerEntityState(event)
                   return event
                 })),
                 tap(occurrenceEvents => this.logger.debug('occurence events transformed:', occurrenceEvents))
               )
  }

  loadMonthDurationEvents(month: DateTime): Observable<DurationEventModel[]> {
    const options = {
      params         : this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
               .get<EventsForPeriodResponseModel>(this.durationUrl, options)
               .pipe(
                 tap(responseModel => this.logger.debug('duration events loaded from the cloud:', responseModel)),
                 map(responseModel => responseModel.durations.map(x => {
                   const event = new DurationEventModel(x)
                   this.registerEntityState(event)
                   return event
                 })),
                 tap(durationEvents => this.logger.debug('duration events transformed:', durationEvents))
               )
  }

  getPeriodParamsFromMonth(month: DateTime): HttpParams {
    const firstMonthDay = DateTime.fromObject({year: month.year, month: month.month, day: 1})
    const lastMonthDay  = DateTime.fromObject({year: month.year, month: month.month, day: month.daysInMonth})

    return new HttpParams().set('start', firstMonthDay.toFormat(this.periodFormat))
                           .set('end', lastMonthDay.toFormat(this.periodFormat))
  }

  deleteEvent(entity: SomeEventModel): Observable<SomeEventModel> {
    const eventKind = entity instanceof OccurrenceEventModel
                      ? 'occurrence_event'
                      : 'duration_event'
    const params    = new HttpParams().set('entity_type', eventKind)
    const options   = {params, withCredentials: true}
    return this.http.delete<SomeEventModel>(this.entityUrl + entity.id, options)
  }
}
