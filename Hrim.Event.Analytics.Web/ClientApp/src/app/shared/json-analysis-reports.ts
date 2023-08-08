
export type IncomingAnalysisReport = GapIncomingReport | CountIncomingReport

export class IncomingAnalysisResult {
  code: string
  /** @summary json of one of these types: IncomingAnalysisReport */
  result_json: string
  calculated_at: string
}

export type GapIncomingReport = {
  Min: string,
  MinGapDate: string
  Max: string,
  MaxGapDate: string
  Avg: string,
  GapCount: number,
  EventCount: number
}

export type CountIncomingReport = {
  MinDuration: string,
  MinDurationDate: string
  MaxDuration: string,
  MaxDurationDate: string
  AvgDuration: string,
  TotalDuration: string,
  OccurrencesCount: number,
  DurationsCount: number
}
