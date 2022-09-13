import {DateTime} from "luxon";
import {BaseEvent, DurationEvent, OccurrenceEvent} from "../shared/events.model";
import {from, Observable, of} from "rxjs";

export class EventOfDayModel {
  id: string
  name: string
  color: string
  date: DateTime

  constructor(baseEvent: BaseEvent, date: DateTime) {
    this.id = baseEvent.id
    this.color = baseEvent.color
    this.date = date
  }
}
