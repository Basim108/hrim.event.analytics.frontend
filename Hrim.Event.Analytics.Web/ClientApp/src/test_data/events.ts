import {OccurrenceEventModel} from "../app/shared/occurrence-event.model";
import {DateTime} from "luxon";

export const EVENTS: { [name: string]: OccurrenceEventModel } = {
  eventOfDay_1: {
    id:         "07f4cb3d-7a2b-4abc-bead-ece3389012d7",
    color:      "#86b2a8",
    occurredAt: DateTime.now(),
    occurredOn: DateTime.now().toISODate(),
    eventTypeId: "8087918a-1cb4-4b54-8a5d-86aec26025ea",
    concurrentToken: 1
  },
  eventOfDay_2: {
    id:         "b0ff15c2-cf9f-41eb-9a36-158728b2cffa",
    color:      "#333333",
    occurredAt: DateTime.now(),
    occurredOn: DateTime.now().toISODate(),
    eventTypeId: "dbbb1326-0b69-4b1b-a54a-25bcc4b07bb5",
    concurrentToken: 1
  }
}
