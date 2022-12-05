import {HrimEventModel} from "../app/shared/hrim-event.model";
import {DateTime} from "luxon";

export const EVENTS: { [name: string]: HrimEventModel } = {
  eventOfDay_1: {
    id: "07f4cb3d-7a2b-4abc-bead-ece3389012d7",
    color: "#86b2a8",
    date: DateTime.now(),
    name: "redundant"
  },
  eventOfDay_2: {
    id: "b0ff15c2-cf9f-41eb-9a36-158728b2cffa",
    color: "#333333",
    date: DateTime.now(),
    name: "redundant"
  }
}
