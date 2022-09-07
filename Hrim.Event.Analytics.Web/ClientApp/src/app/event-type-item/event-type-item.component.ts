import {Component, Input} from '@angular/core';
import {UserEventType} from "../shared/event-type.model";
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-event-type-item',
  templateUrl: './event-type-item.component.html',
  styleUrls: ['./event-type-item.component.css']
})
export class EventTypeItemComponent {
  @Input('eventType') eventType: UserEventType;

  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }
}
