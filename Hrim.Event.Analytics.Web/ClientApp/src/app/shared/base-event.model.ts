import {UserEventType} from "./event-type.model";

export abstract class BaseEventModel {
  id: string
  eventType: UserEventType
  concurrentToken: number

  protected constructor(model: BaseEventSnakeModel | null) {
    if (!model) {
      return;
    }
    this.id              = model.id
    this.eventType       = model.event_type
    this.concurrentToken = model.concurrent_token
  }
}

export abstract class BaseEventSnakeModel {
  id: string
  event_type: UserEventType
  concurrent_token: number
}
