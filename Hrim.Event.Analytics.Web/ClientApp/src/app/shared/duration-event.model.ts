import {DateTime} from 'luxon'
import {BaseEventModel, BaseEventSnakeModel} from './base-event.model'

export class DurationEventModel extends BaseEventModel {
  startedAt: DateTime
  startedOn: string
  finishedAt: DateTime | null
  finishedOn: string | null

  constructor(model: DurationEventSnakeModel | null) {
    super(model)
    if (!model) return
    this.startedAt = DateTime.fromISO(model.started_at)
    this.startedOn = this.startedAt.toISODate()
    if (model.finished_at) {
      this.finishedAt = DateTime.fromISO(model.finished_at)
      this.finishedOn = this.finishedAt.toISODate()
    }
  }
}

export class DurationEventSnakeModel
  extends BaseEventSnakeModel {
  started_at: string
  finished_at: string | null

  constructor(model: DurationEventModel) {
    super(model);
    this.started_at = model.startedAt.toISO()
    this.finished_at = model.finishedAt?.toISO() ?? null
  }
}
