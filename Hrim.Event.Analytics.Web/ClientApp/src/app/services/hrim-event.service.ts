import {Injectable} from '@angular/core'
import {OccurrenceEventModel, OccurrenceEventSnakeModel} from '../shared/occurrence-event.model'
import {map, Observable, Subject} from 'rxjs'
import {LogService} from './log.service'
import {HttpClient, HttpParams} from '@angular/common/http'
import {tap} from 'rxjs/operators'
import {DateTime} from 'luxon'
import EventsForPeriodResponseModel from '../shared/events-for-period-response.model'
import {DurationEventModel, DurationEventSnakeModel} from '../shared/duration-event.model'
import {SomeEventModel} from "../shared/some-event.model";
import {EntityState} from "../shared/entity-state";
import {BackendUrlService} from "./backend-url.service";
import {UserEventType} from "../shared/event-type.model";
import {EventTypeService} from "./user-event-type.service";

@Injectable({providedIn: 'root'})
export class HrimEventService {
  createdOccurrences$ = new Subject<OccurrenceEventModel>()
  createdDurations$ = new Subject<DurationEventModel>()
  occurrenceUrl = 'v1/event/occurrence'
  durationUrl = 'v1/event/duration'
  entityUrl = 'v1/entity'
  periodFormat = 'yyyy-MM-d'

  eventContext: { [eventId: string]: EntityState<SomeEventModel> } = {}

  constructor(private logger: LogService,
              private urlService: BackendUrlService,
              private eventTypeService: EventTypeService,
              private http: HttpClient) {
    logger.logConstructor(this)
  }

  createEvent(model: SomeEventModel): EntityState<SomeEventModel> {
    const entityState = this.registerEventContext(model)
    entityState.isCreated = true
    entityState.isUnsaved = true
    if (model.isOccurrence) {
      this.createOccurrenceEvent(model as OccurrenceEventModel)
    } else {
      this.createDurationEvent(model as DurationEventModel)
    }
    return entityState
  }

  private createOccurrenceEvent(model: OccurrenceEventModel) {
    const options = {
      withCredentials: true
    }
    const body = {
      occurred_at: model.occurredAt,
      event_type_id: model.eventType.id
    }
    this.http
      .post<OccurrenceEventSnakeModel>(`${this.urlService.crudApiUrl}/${this.occurrenceUrl}`, body, options)
      .subscribe({
        next: createdEvent => {
          const event = new OccurrenceEventModel(createdEvent, model.eventType)
          this.contextSaved(model, event)
          this.createdOccurrences$.next(event)
        },
        error: err => this.logger.error('Occurrence event creation failed: ' + err, model)
      })
  }

  private createDurationEvent(model: DurationEventModel) {
    const options = {
      withCredentials: true
    }
    const body = {
      started_at: model.startedAt,
      finished_at: model.finishedAt,
      event_type_id: model.eventType.id
    }
    this.http
      .post<DurationEventSnakeModel>(`${this.urlService.crudApiUrl}/${this.durationUrl}`, body, options)
      .subscribe({
        next: createdEvent => {
          const event = new DurationEventModel(createdEvent, model.eventType)
          this.contextSaved(model, event)
          this.createdDurations$.next(event)
        },
        error: err => this.logger.error('Occurrence event creation failed: ' + err, model)
      })
  }

  updateEventTypesForEvents(changedEventType: UserEventType) {
    let eventInfoList = Object.values(this.eventContext)
      .filter(info => info.entity.eventType.id == changedEventType.id)
    eventInfoList.forEach(info => info.entity.eventType = changedEventType)
  }

  private contextSaved(modelCandidate: SomeEventModel, savedModel: SomeEventModel) {
    let eventContext = Object.values(this.eventContext).find(x => x.entity.id === modelCandidate.id)
    if (eventContext) {
      eventContext.entity = savedModel
    } else {
      eventContext = this.registerEventContext(savedModel)
    }
    eventContext.isDeleted = false
    eventContext.isModified = false
    eventContext.isCreated = false
    eventContext.isUnsaved = false
  }

  registerEventContext(entity: SomeEventModel): EntityState<SomeEventModel> {
    let eventContext = this.eventContext[entity.id]
    if (eventContext) {
      eventContext.entity = entity
    } else {
      eventContext = new EntityState<SomeEventModel>()
      eventContext.entity = entity
      this.eventContext[entity.id] = eventContext
    }
    return eventContext
  }

  loadMonthOccurrenceEvents(month: DateTime): Observable<OccurrenceEventModel[]> {
    const options = {
      params: this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
      .get<EventsForPeriodResponseModel>(`${this.urlService.crudApiUrl}/${this.occurrenceUrl}`, options)
      .pipe(
        tap(responseModel => this.logger.debug('occurence events loaded from the cloud:', responseModel)),
        map(responseModel => responseModel.occurrences.map(x => {
          const event = new OccurrenceEventModel(x, null)
          this.registerEventContext(event)
          return event
        })),
        tap(occurrenceEvents => this.logger.debug('occurence events transformed:', occurrenceEvents))
      )
  }

  loadMonthDurationEvents(month: DateTime): Observable<DurationEventModel[]> {
    const options = {
      params: this.getPeriodParamsFromMonth(month),
      withCredentials: true
    }
    return this.http
      .get<EventsForPeriodResponseModel>(`${this.urlService.crudApiUrl}/${this.durationUrl}`, options)
      .pipe(
        tap(responseModel => this.logger.debug('duration events loaded from the cloud:', responseModel)),
        map(responseModel => responseModel.durations.map(x => {
          const event = new DurationEventModel(x, null)
          this.registerEventContext(event)
          return event
        })),
        tap(durationEvents => this.logger.debug('duration events transformed:', durationEvents))
      )
  }

  getPeriodParamsFromMonth(month: DateTime): HttpParams {
    const firstMonthDay = DateTime.fromObject({year: month.year, month: month.month, day: 1})
    const lastMonthDay = DateTime.fromObject({year: month.year, month: month.month, day: month.daysInMonth})

    return new HttpParams().set('start', firstMonthDay.toFormat(this.periodFormat))
      .set('end', lastMonthDay.toFormat(this.periodFormat))
  }

  deleteEvent(entity: SomeEventModel): Observable<SomeEventModel> {
    const eventKind = entity.isOccurrence
      ? 'occurrence_event'
      : 'duration_event'
    const params = new HttpParams().set('entity_type', eventKind)
    const options = {params, withCredentials: true}
    return this.http.delete<SomeEventModel>(`${this.urlService.crudApiUrl}/${this.entityUrl}/${entity.id}`, options)
  }

  save(model: SomeEventModel): Observable<SomeEventModel> {
    const options = {withCredentials: true};
    const body = model.isOccurrence
      ? {
        id: model.id,
        concurrent_token: model.concurrentToken,
        occurred_at: (model as OccurrenceEventModel).occurredAt.toISO(),
        event_type_id: model.eventType.id
      }
      : {
        id: model.id,
        concurrent_token: model.concurrentToken,
        started_at: (model as DurationEventModel).startedAt.toISO(),
        finished_at: (model as DurationEventModel).finishedAt?.toISO() ?? undefined,
        event_type_id: model.eventType.id
      }
    return model.isOccurrence
      ? this.http.put<OccurrenceEventSnakeModel>(`${this.urlService.crudApiUrl}/${this.occurrenceUrl}`, body, options)
        .pipe(
          tap(x => this.logger.debug('successfully updated an event', x)),
          map(x => this.processOccurrenceSaveResponse(x, model)),
          tap(x => this.logger.debug('updated event model transformed', x)))
      : this.http.put<DurationEventSnakeModel>(`${this.urlService.crudApiUrl}/${this.durationUrl}`, body, options)
        .pipe(
          tap(x => this.logger.debug('successfully updated an event', x)),
          map(x => this.processDurationSaveResponse(x, model)),
          tap(x => this.logger.debug('updated event model transformed', x)))
  }

  private processOccurrenceSaveResponse(snakeModel: OccurrenceEventSnakeModel, beforeSaveModel: SomeEventModel):OccurrenceEventModel {
    const event = new OccurrenceEventModel(snakeModel, this.eventTypeService.getEventType(snakeModel.event_type_id))
    event.eventType = beforeSaveModel.eventType
    this.contextSaved(beforeSaveModel, event)
    return event
  }

  private processDurationSaveResponse(snakeModel: DurationEventSnakeModel, beforeSaveModel: SomeEventModel):DurationEventModel {
    const event = new DurationEventModel(snakeModel, this.eventTypeService.getEventType(snakeModel.event_type_id))
    event.eventType = beforeSaveModel.eventType
    this.contextSaved(beforeSaveModel, event)
    return event
  }
}
