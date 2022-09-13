import {DurationEvent, OccurrenceEvent} from "./events.model";
import {DateTime} from "luxon";

export class QueryRange {
  start: DateTime
  end: DateTime
}

export class GetEventsData {
  readonly request: QueryRange;

  constructor(public durations: DurationEvent[],
              public occurrences: OccurrenceEvent[],
              start: string, end: string) {
    this.request = {
      start: DateTime.fromISO(start),
      end: DateTime.fromISO(end)
    }
  }
}
