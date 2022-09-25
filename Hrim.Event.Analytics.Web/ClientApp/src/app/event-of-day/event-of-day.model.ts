import {DateTime} from "luxon";
import {BaseEvent} from "../shared/events.model";

export class EventOfDayModel<T extends BaseEvent> {
  id: string
  name: string
  color: string
  date: DateTime

  constructor(public businessModel: T, date: DateTime) {
    this.id = businessModel.id
    this.color = businessModel.color || '#83ee84'
    this.date = date
  }
}
