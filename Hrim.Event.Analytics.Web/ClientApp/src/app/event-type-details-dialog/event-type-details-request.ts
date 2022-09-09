import {UserEventType} from "../event-type-item/event-type.model";

export class EventTypeDetailsRequest {
  title: string
  action: string

  constructor(public eventType: UserEventType, isEdit: boolean = false) {
    this.title = isEdit ? 'Edit' : 'Create';
    this.action = isEdit ? 'Save' : 'Create';
  }
}
