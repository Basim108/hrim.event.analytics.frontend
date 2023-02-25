import {UserEventType} from "../../shared/event-type.model";

export class EventTypeDetailsRequest {
  title: string
  action: string

  constructor(public eventType: UserEventType, isEdit: boolean = false) {
    this.title = isEdit ? 'Edit event type' : 'Create a new type of events';
    this.action = isEdit ? 'Save' : 'Create';
  }
}
