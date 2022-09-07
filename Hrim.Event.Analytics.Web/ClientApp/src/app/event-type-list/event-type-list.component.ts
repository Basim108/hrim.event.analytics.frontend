import {Component, OnDestroy, OnInit} from '@angular/core';
import {LogService} from "../services/log.service";
import {EventTypeService} from "../services/user-event-type.service";
import {UserEventType} from "../shared/event-type.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.css']
})
export class EventTypeListComponent implements OnInit, OnDestroy {
  eventTypes: UserEventType[] = [];
  eventTypesSub: Subscription;

  constructor(private logger: LogService,
              private eventTypeService: EventTypeService) {
    logger.logConstructor(this);
  }

  ngOnDestroy(): void {
    this.eventTypesSub.unsubscribe();
  }

  ngOnInit(): void {
    this.eventTypesSub = this.eventTypeService.eventTypes.subscribe(eventTypes => this.eventTypes = eventTypes);
    this.eventTypeService.load();
  }

  createEventType() {
    // TODO: implement in the HC-43 task
    // this.eventTypeService.createEventType(newEventType);
  }
}
