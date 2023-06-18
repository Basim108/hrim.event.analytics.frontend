import {DateTime} from 'luxon'
import {BaseEventModel, BaseEventSnakeModel} from './base-event.model'
import {UserEventType} from "./event-type.model";

export class OccurrenceEventModel extends BaseEventModel {
  occurredAt: DateTime
  occurredOn: string

  constructor(model: OccurrenceEventSnakeModel | null, eventType: UserEventType | null) {
    super(model, eventType)
    this.isOccurrence = true
    if (!model) return
    this.occurredAt = DateTime.fromISO(model.occurred_at)
    this.occurredOn = this.occurredAt.toISODate()
  }
}

export class OccurrenceEventSnakeModel extends BaseEventSnakeModel {
  occurred_at: string

  constructor(model: OccurrenceEventModel) {
    super(model);
    this.occurred_at = model.occurredAt.toISO()
  }
}
