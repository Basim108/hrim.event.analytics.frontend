import {Injectable} from "@angular/core";
import {LogService} from "./log.service";
import {map, Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserEventType} from "../event-type-item/event-type.model";

@Injectable({providedIn: 'root'})
export class EventTypeService {
  eventTypes = new Subject<UserEventType[]>();

  url = `${environment.apiUrl}/v1/event-type/`;
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
            this.eventTypes.next(userEventTypes);
          }
        });
  }

  saveEventType(entity: UserEventType): Observable<UserEventType> {
    const options = {withCredentials: true};
    return entity.id
           ? this.http.put<UserEventType>(this.url, entity, options)
           : this.http.post<UserEventType>(this.url, entity, options);
  }

  getDetails(entityId: string): Observable<UserEventType> {
    return this.http.get<UserEventType>(this.url + entityId, {
      withCredentials: true
    });
  }

  deleteEventType(entity: UserEventType): Observable<UserEventType> {
    const params = new HttpParams().set('entity_type', 'event_type')
    const options = {params, withCredentials: true}
    return this.http.delete<UserEventType>(this.entityUrl + entity.id, options);
  }
}
