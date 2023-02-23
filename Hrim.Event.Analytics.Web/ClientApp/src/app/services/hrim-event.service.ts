import {Injectable} from '@angular/core'
import {OccurrenceEventModel} from '../shared/occurrence-event.model'
import {map, Observable, ReplaySubject} from 'rxjs'
import {LogService} from './log.service'
import {HttpClient, HttpParams} from '@angular/common/http'
import {tap} from 'rxjs/operators'
import {environment} from '../../environments/environment'
import {DateTime} from 'luxon'
import EventsForPeriodResponseModel from '../shared/events-for-period-response.model'
import {DurationEventModel} from '../shared/duration-event.model'

@Injectable({providedIn: 'root'})
export class HrimEventService {
  occurrenceEvents$ = new ReplaySubject<OccurrenceEventModel>()
  occurrenceUrl               = `${environment.apiUrl}/v1/event/occurrence`
  durationUrl               = `${environment.apiUrl}/v1/event/duration`
  entityUrl         = `${environment.apiUrl}/v1/entity/`
  periodFormat      = 'yyyy-MM-d'

  constructor(private logger: LogService,
              private http: HttpClient) {
    logger.logConstructor(this)
  }

  createEvent(model: OccurrenceEventModel): void {
    model.id = crypto.randomUUID()
    this.occurrenceEvents$.next(model)
  }

  loadMonthOccurrenceEvents(month: DateTime): Observable<OccurrenceEventModel[]> {
    const options = {
      params:          this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
               .get<EventsForPeriodResponseModel>(this.occurrenceUrl, options)
               .pipe(
                 tap(responseModel => this.logger.debug('occurence events loaded from the cloud:', responseModel)),
                 map(responseModel => responseModel.occurrences.map(x => new OccurrenceEventModel(x))),
                 tap(occurrenceEvents => this.logger.debug('occurence events transformed:', occurrenceEvents))
               )
  }

  loadMonthDurationEvents(month: DateTime): Observable<DurationEventModel[]> {
    const options = {
      params:          this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
               .get<EventsForPeriodResponseModel>(this.durationUrl, options)
               .pipe(
                 tap(responseModel => this.logger.debug('duration events loaded from the cloud:', responseModel)),
                 map(responseModel => responseModel.durations.map(x => new DurationEventModel(x))),
                 tap(durationEvents => this.logger.debug('duration events transformed:', durationEvents))
               )
  }

  getPeriodParamsFromMonth(month: DateTime): HttpParams {
    const firstMonthDay = DateTime.fromObject({year: month.year, month: month.month, day: 1})
    const lastMonthDay  = DateTime.fromObject({year: month.year, month: month.month, day: month.daysInMonth})

    return new HttpParams().set('start', firstMonthDay.toFormat(this.periodFormat))
                           .set('end', lastMonthDay.toFormat(this.periodFormat))
  }

  deleteEvent(entity: OccurrenceEventModel): Observable<OccurrenceEventModel> {
    const params  = new HttpParams().set('entity_type', 'duration_event')
    const options = {params, withCredentials: true}
    return this.http.delete<OccurrenceEventModel>(this.entityUrl + entity.id, options)
  }
}
