import {HrimEntity} from "./hrim-entity";

export type AnyEvent = DurationEvent | OccurrenceEvent

export class BaseEvent extends HrimEntity{
  event_type_id: string
  color: string
}

export class DurationEvent extends BaseEvent {
  started_at: string
  finished_at: string | null
}

export class OccurrenceEvent extends BaseEvent {
  occurred_at: string
}
