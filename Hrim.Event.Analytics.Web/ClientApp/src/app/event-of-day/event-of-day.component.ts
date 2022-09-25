import {Component, Input} from '@angular/core';
import {EventOfDayModel} from "./event-of-day.model";
import {LogService} from "../services/log.service";
import {AnyEvent} from "../shared/events.model";

@Component({
  selector: 'app-event-of-day',
  templateUrl: './event-of-day.component.html',
  styleUrls: ['./event-of-day.component.css']
})
export class EventOfDayComponent {
  @Input() eventOfDay: EventOfDayModel<AnyEvent>;
  @Input() totalEventCount: number;

  constructor(private logger: LogService) {
    logger.logConstructor(this);
  }

  getEventHeight(){
    return (100 / this.totalEventCount) + '%';
  }
}
