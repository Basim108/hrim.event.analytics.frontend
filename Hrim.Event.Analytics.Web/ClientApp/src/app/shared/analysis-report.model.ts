import {DateTime, Duration} from "luxon";
import {
  CountIncomingReport, GapIncomingReport, IncomingAnalysisResult
} from "./json-analysis-reports";
import {COUNT_ANALYSIS_CODE, GAP_ANALYSIS_CODE} from "./analysis-feature.model";

export class AnalysisReports {
  public gapReport: GapAnalysisReport | null = null
  public countReport: CountAnalysisReport | null = null

  constructor(analysisResults: IncomingAnalysisResult[]) {
    const incomingGap = analysisResults.find(x => x.code === GAP_ANALYSIS_CODE)
    const incomingCount = analysisResults.find(x => x.code === COUNT_ANALYSIS_CODE)
    if (incomingCount)
      this.countReport = new CountAnalysisReport(incomingCount)
    if (incomingGap)
      this.gapReport = new GapAnalysisReport(incomingGap)
  }
}

class AnalysisReport {
  public calculatedAt: DateTime

  constructor(calculatedAtIso: string) {
    this.calculatedAt = DateTime.fromISO(calculatedAtIso)
  }
}

export class CountAnalysisReport extends AnalysisReport {
  minDuration: Duration
  minDurationDate: DateTime
  maxDuration: Duration
  maxDurationDate: DateTime
  avgDuration: Duration
  totalDuration: Duration
  /** @summary number of occurrence events participated in analysis */
  occurrences: number
  /** @summary number of duration events participated in analysis */
  durations: number

  constructor(info: IncomingAnalysisResult) {
    super(info.calculated_at)
    const result = JSON.parse(info.result_json) as CountIncomingReport
    this.minDuration = fromDotNetTimeStamp(result.MinDuration)
    this.maxDuration = fromDotNetTimeStamp(result.MaxDuration)
    this.avgDuration = fromDotNetTimeStamp(result.AvgDuration)
    this.totalDuration = fromDotNetTimeStamp(result.TotalDuration)
    this.minDurationDate = DateTime.fromISO(result.MinDurationDate)
    this.maxDurationDate = DateTime.fromISO(result.MaxDurationDate)
    this.occurrences = result.OccurrencesCount
    this.durations = result.DurationsCount
  }
}

export class GapAnalysisReport extends AnalysisReport {
  minGap: Duration
  minGapDate: DateTime
  maxGap: Duration
  maxGapDate: DateTime
  avgGap: Duration
  /** @summary number of gaps found */
  gaps: number
  /** @summary number of events participated in analysis */
  events: number

  constructor(info: IncomingAnalysisResult) {
    super(info.calculated_at);
    const result = JSON.parse(info.result_json) as GapIncomingReport
    this.minGap = fromDotNetTimeStamp(result.Min)
    this.maxGap = fromDotNetTimeStamp(result.Max)
    this.avgGap = fromDotNetTimeStamp(result.Avg)
    this.minGapDate = DateTime.fromISO(result.MinGapDate)
    this.maxGapDate = DateTime.fromISO(result.MaxGapDate)
    this.gaps = result.GapCount
    this.events = result.EventCount
  }
}

function fromDotNetTimeStamp(timestamp: string): Duration {
  const parts = timestamp.split(':')
  const dotIdx = parts[0].indexOf('.')
  const days = dotIdx < 0 ? 0 : Number(parts[0].slice(0, dotIdx + 1))
  const hours = dotIdx < 0 ? Number(parts[0]) : Number(parts[0].slice(dotIdx, parts[0].length - dotIdx + 1))
  const minutes = Number(parts[1])
  const seconds = Number(parts[2])
  const obj: any = {}
  if (days > 0)
    obj.days = Number(days)
  if (hours > 0)
    obj.hours = hours
  if (minutes > 0)
    obj.minutes = minutes
  if (seconds > 0)
    obj.seconds = seconds
  return Duration.fromObject(obj)
}
