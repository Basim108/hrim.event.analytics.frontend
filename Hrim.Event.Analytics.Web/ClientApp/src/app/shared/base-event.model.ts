import {UserEventType} from "./event-type.model";
import {EntityModel}   from "./entity.model";

export abstract class BaseEventModel extends EntityModel {
  eventType: UserEventType

  protected constructor(model: BaseEventSnakeModel | null) {
    super(model?.id ?? '', model?.concurrent_token ?? -1)
    if (!model) {
      return;
    }
    this.eventType = model.event_type
  }
}

export abstract class BaseEventSnakeModel {
  id: string
  event_type: UserEventType
  event_type_id: string
  concurrent_token: number

  protected constructor(model: BaseEventModel) {
    this.id               = model.id
    this.event_type       = model.eventType
    this.event_type_id    = model.eventType.id
    this.concurrent_token = model.concurrentToken
  }
}
