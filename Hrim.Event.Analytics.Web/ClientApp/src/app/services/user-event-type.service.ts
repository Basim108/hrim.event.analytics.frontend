import {Injectable} from "@angular/core";
import {LogService} from "./log.service";
import {BehaviorSubject} from "rxjs";
import {UserEventType} from "../shared/event-type.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class EventTypeService {
  eventTypes = new BehaviorSubject<UserEventType[]>([]);

  constructor(private logger: LogService,
              private http: HttpClient) {
    logger.logConstructor(this);

  }

  load() {
    this.http.get<UserEventType[]>(`${environment.apiUrl}/v1/event-type/`, {
      withCredentials: true
    }).subscribe({
      next: userEventTypes => {
        this.logger.debug('User event types loaded from server:', userEventTypes)
        this.eventTypes.next(userEventTypes);
      },
      error: error => {
        switch (error.status) {
          case 0:
          case 401:
          case 403:
            this.eventTypes.next([]);
            break;
          default:
            this.logger.error(`failed request: (${error.status}) ${error.message}`, error)
        }
      }
    });
  }

  createEventType(entity: UserEventType){
    // TODO: implement in the HC-43 task
  }

  deleteEventType(entity: UserEventType){
    // TODO: implement in the HC-44 task
  }
}
