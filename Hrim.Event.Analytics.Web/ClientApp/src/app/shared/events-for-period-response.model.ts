import {OccurrenceEventSnakeModel} from './occurrence-event.model'
import {DurationEventSnakeModel} from './duration-event.model'

export default interface EventsForPeriodResponseModel {
  durations: DurationEventSnakeModel[],
  occurrences: OccurrenceEventSnakeModel[],
  request: { start: string, end: string }
}
