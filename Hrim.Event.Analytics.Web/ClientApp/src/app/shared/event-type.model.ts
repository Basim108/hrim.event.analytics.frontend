import {AnalysisReports} from "./analysis-report.model";
import {IncomingAnalysisResult} from "./json-analysis-reports";

export class UserEventType {
  id: string
  name: string = ''
  description: string | null = ''
  color: string = ''
  is_deleted: boolean
  is_mine: boolean
  concurrent_token: number
  analysis_results: IncomingAnalysisResult[]
  analysisReports: AnalysisReports | null = null
}
