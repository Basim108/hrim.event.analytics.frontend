import {DateTime} from 'luxon'
import {BaseEventModel, BaseEventSnakeModel} from './base-event.model'

export class OccurrenceEventModel extends BaseEventModel {
  occurredAt: DateTime
  occurredOn: string

  constructor(model: OccurrenceEventSnakeModel | null) {
    super(model)
    if (!model) return
    this.occurredAt = DateTime.fromISO(model.occurred_at)
    this.occurredOn = this.occurredAt.toISODate()
  }
}

export class OccurrenceEventSnakeModel extends BaseEventSnakeModel {
  occurred_at: string
}
