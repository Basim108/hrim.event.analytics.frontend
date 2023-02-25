import {OccurrenceEventModel} from "../app/shared/occurrence-event.model";
import {DateTime}             from "luxon";
import {EVENT_TYPES}          from "./event-types";

export const EVENTS: { [name: string]: OccurrenceEventModel } = {
  eventOfDay_1: {
    id:         "07f4cb3d-7a2b-4abc-bead-ece3389012d7",
    occurredAt: DateTime.now(),
    occurredOn: DateTime.now().toISODate(),
    eventType: EVENT_TYPES['reading'],
    concurrentToken: 1
  },
  eventOfDay_2: {
    id:         "b0ff15c2-cf9f-41eb-9a36-158728b2cffa",
    occurredAt: DateTime.now(),
    occurredOn: DateTime.now().toISODate(),
    eventType: EVENT_TYPES['yogaPractice'],
    concurrentToken: 1
  }
}
