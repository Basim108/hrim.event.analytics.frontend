import {OccurrenceEventModel, OccurrenceEventSnakeModel} from "./occurrence-event.model";
import {DurationEventModel, DurationEventSnakeModel}     from "./duration-event.model";

export type SomeEventModel = OccurrenceEventModel | DurationEventModel
