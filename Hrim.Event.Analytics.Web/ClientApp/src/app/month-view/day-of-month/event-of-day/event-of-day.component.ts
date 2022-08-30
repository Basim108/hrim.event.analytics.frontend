import {Component, Input, OnInit} from '@angular/core';
import {HrimEventModel} from "../../../shared/hrim-event.model";
import {LogService} from "../../../services/log.service";

@Component({
  selector: 'app-event-of-day',
  templateUrl: './event-of-day.component.html',
  styleUrls: ['./event-of-day.component.css']
})
export class EventOfDayComponent implements OnInit {
  @Input() eventOfDay: HrimEventModel;
  @Input() totalEventCount: number;

  constructor(private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnInit(): void {
  }

  getEventHeight(){
    return (100 / this.totalEventCount) + '%';
  }
}
