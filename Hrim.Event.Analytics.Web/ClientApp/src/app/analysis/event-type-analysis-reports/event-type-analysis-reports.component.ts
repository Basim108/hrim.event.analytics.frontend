import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnalysisReports} from "../../shared/analysis-report.model";
import {Subscription} from "rxjs";
import {LogService} from "../../services/log.service";
import {AnalysisSettingService} from "../../services/analysis-setting.service";
import {AnalysisFeatureModel, COUNT_ANALYSIS_CODE, GAP_ANALYSIS_CODE} from "../../shared/analysis-feature.model";
import {UserEventType} from "../../shared/event-type.model";

@Component({
  selector   : 'event-type-analysis-reports',
  templateUrl: './event-type-analysis-reports.component.html',
  styleUrls  : ['./event-type-analysis-reports.component.css']
})
export class EventTypeAnalysisReportsComponent implements OnInit, OnDestroy {
  @Input("reports") eventType: UserEventType
  analysisReports: AnalysisReports | null
  @Input() availableAnalysis: AnalysisFeatureModel[]

  selectedAnalysisCode: string
  isGapSelected: boolean = false
  isCountSelected: boolean = false

  availableAnalysisSub: Subscription


  constructor(private logger: LogService,
              private analysisSettingService: AnalysisSettingService) {
    logger.logConstructor(this)
  }

  ngOnInit(): void {
    this.analysisReports = this.eventType.analysisReports
    this.availableAnalysisSub = this.analysisSettingService
                                    .availableAnalysis$
                                    .subscribe({
                                      next: info => {
                                        this.availableAnalysis = info
                                        if (!this.selectedAnalysisCode) {
                                          this.selectedAnalysisCode = info[0].code
                                          this.selectedAnalysisChanged({ value: this.selectedAnalysisCode })
                                        }
                                      }
                                    })
  }

  ngOnDestroy() {
    this.availableAnalysisSub?.unsubscribe()
  }

  getSelectedAnalysisDescription(): string {
    const feature = this.availableAnalysis.find(x => x.code === this.selectedAnalysisCode)
    return feature?.description || feature?.code || 'unknown feature'
  }

  selectedAnalysisChanged({value}: { value: string }) {
    this.isCountSelected = value === COUNT_ANALYSIS_CODE
    this.isGapSelected = value === GAP_ANALYSIS_CODE
  }
}
