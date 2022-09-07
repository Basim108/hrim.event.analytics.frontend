import {Component, Input, OnInit} from '@angular/core';
import {UserEventType} from "../shared/event-type.model";

@Component({
  selector: 'app-event-type-item',
  templateUrl: './event-type-item.component.html',
  styleUrls: ['./event-type-item.component.css']
})
export class EventTypeItemComponent implements OnInit {
  @Input('eventType') eventType: UserEventType;

  constructor() { }

  ngOnInit(): void {
  }

}
