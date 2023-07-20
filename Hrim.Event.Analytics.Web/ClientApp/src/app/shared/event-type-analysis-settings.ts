export type AnyEventTypeAnalysisSettings = EventTypeGapAnalysisSettings | EventTypeCountAnalysisSettings

export class EventTypeAnalysisSettings {
  event_type_id: string
  analysis_code: string
  is_on: boolean
  concurrent_token: number
  /** when feature is turned off on the server then this analysis should be disabled */
  is_disabled: boolean
  description: string
}

export class EventTypeGapAnalysisSettings extends EventTypeAnalysisSettings {
  settings: { minimal_gap_length: string }
}

export class EventTypeCountAnalysisSettings extends EventTypeAnalysisSettings {

}
