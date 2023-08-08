import {UserEventType} from "./event-type.model";
import {EntityModel} from "./entity.model";

export abstract class BaseEventModel extends EntityModel {
  eventType: UserEventType

  public isOccurrence: boolean = false
  public props: { note: string } 
  
  protected constructor(snakeModel: BaseEventSnakeModel | null, eventType: UserEventType | null) {
    super(snakeModel?.id ?? '', snakeModel?.concurrent_token ?? -1)
    if (!snakeModel) {
      return
    }
    if(!snakeModel.event_type && !eventType){
      throw new Error('eventType property is falsy')
    }
    this.eventType = snakeModel.event_type || eventType!
    this.props = snakeModel.props || { note: '' }
  }
}

export abstract class BaseEventSnakeModel {
  id: string
  event_type: UserEventType | null
  event_type_id: string
  concurrent_token: number
  props: {note: string}

  protected constructor(model: BaseEventModel) {
    this.id = model.id
    this.event_type = model.eventType
    this.event_type_id = model.eventType.id
    this.concurrent_token = model.concurrentToken
  }
}
