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
  concurrent_token: number
}
