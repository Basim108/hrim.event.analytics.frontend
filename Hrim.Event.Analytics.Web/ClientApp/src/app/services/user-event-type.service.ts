import {Injectable}             from "@angular/core";
import {LogService}             from "./log.service";
import {Observable, Subject}    from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment}            from "../../environments/environment";
import {UserEventType}          from "../shared/event-type.model";
import {EntityState}            from "../shared/entity-state";

@Injectable({providedIn: 'root'})
export class EventTypeService {
  eventTypes$        = new Subject<UserEventType[]>();
  selectedTypesInfo$ = new Subject<void>();

  typeContexts: { [eventTypeId: string]: EntityState<UserEventType> } = {}

  url       = `${environment.apiUrl}/v1/event-type/`;
  entityUrl = `${environment.apiUrl}/v1/entity/`;

  constructor(private logger: LogService,
              private http: HttpClient) {
    logger.logConstructor(this);
  }

  load() {
    this.http.get<UserEventType[]>(this.url, {withCredentials: true})
        .subscribe({
                     next: userEventTypes => {
                       this.logger.debug('User event types loaded from server:', userEventTypes)
                       this.eventTypes$.next(userEventTypes);
                       this.synchronizeTypeInfo(userEventTypes)
                     }
                   });
  }

  /**
   * Preserves information (isSelected, etc) for those that exists in input types
   * @param loadedTypes
   */
  synchronizeTypeInfo(loadedTypes: UserEventType[]) {
    for (let type of loadedTypes) {
      this.updateTypeContext(type, false, false, false)
    }
    for (let existedTypeId in this.typeContexts) {
      if (!this.typeContexts.hasOwnProperty(existedTypeId)) {
        continue
      }
      if (loadedTypes.every(x => x.id !== existedTypeId)) {
        delete this.typeContexts[existedTypeId]
      }
    }
    this.selectedTypesInfo$.next()
  }

  /**
   * Updates event type in event type info dictionary
   * @param eventType  - user event type that has to be updated e.g. after editing or creation
   * @param isSelected - should it be selected, for example,
   *                      after creation it should be automatically selected,
   *                      yet after loading from a backend it should not.
   * @param emitChanges for those who subscribe about changes in event type info
   * @param updateExisted
   */
  updateTypeContext(eventType: UserEventType, isSelected: boolean = false, emitChanges = true, updateExisted = true) {
    const info = this.typeContexts[eventType.id]
    if (info) {
      info.entity = eventType
      if (updateExisted) {
        info.isSelected = isSelected
      }
    } else {
      const context      = new EntityState<UserEventType>()
      context.entity     = eventType
      context.isSelected = isSelected

      this.typeContexts[eventType.id] = context
    }
    this.logger.debug('event type info updated', this.typeContexts[eventType.id], this.typeContexts)
    if (emitChanges) {
      this.logger.debug('emitting event type info update status', info)
      this.selectedTypesInfo$.next()
    }
  }

  save(entity: UserEventType): Observable<UserEventType> {
    const options = {withCredentials: true};
    // TODO: check for creation through context.isCreated
    return entity.id
           ? this.http.put<UserEventType>(this.url, entity, options)
           : this.http.post<UserEventType>(this.url, entity, options);
  }

  getDetails(entityId: string): Observable<UserEventType> {
    return this.http.get<UserEventType>(this.url + entityId, {
      withCredentials: true
    });
  }

  delete(entity: UserEventType): Observable<UserEventType> {
    const params  = new HttpParams().set('entity_type', 'event_type')
    const options = {params, withCredentials: true}
    return this.http.delete<UserEventType>(this.entityUrl + entity.id, options);
  }
}
