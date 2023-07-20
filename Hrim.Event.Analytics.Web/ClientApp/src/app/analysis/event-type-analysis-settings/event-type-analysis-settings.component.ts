import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  AnyEventTypeAnalysisSettings,
  EventTypeCountAnalysisSettings,
  EventTypeGapAnalysisSettings
} from "../../shared/event-type-analysis-settings";
import {LogService} from "../../services/log.service";
import {AnalysisFeatureModel, COUNT_ANALYSIS_CODE, GAP_ANALYSIS_CODE} from "../../shared/analysis-feature.model";
import {Subscription} from "rxjs";
import {AnalysisSettingService} from "../../services/analysis-setting.service";

@Component({
  selector   : 'event-type-analysis-settings',
  templateUrl: './event-type-analysis-settings.component.html',
  styleUrls  : ['./event-type-analysis-settings.component.css']
})
export class EventTypeAnalysisSettingsComponent implements OnInit, OnDestroy {
  @Input('eventTypeId') eventTypeId: string
  @Input('settings') settings: AnyEventTypeAnalysisSettings[]
  @Output() changed = new EventEmitter<boolean>()

  isCountChanged: boolean = false
  isGapChanged: boolean = false

  countSettings: EventTypeCountAnalysisSettings | null
  gapSettings: EventTypeGapAnalysisSettings | null

  availableAnalysisSub: Subscription

  constructor(private logger: LogService,
              private analysisSettingService: AnalysisSettingService) {
    logger.logConstructor(this)
  }

  ngOnInit(): void {
    this.parseAnalysisSettings()
    this.availableAnalysisSub = this.analysisSettingService
                                    .availableAnalysis$
                                    .subscribe({
                                      next: info => this.updateFeatures(info)
                                    })
  }

  ngOnDestroy() {
    this.availableAnalysisSub?.unsubscribe()
  }

  onCountChanged($event: boolean) {
    this.isCountChanged = $event
    this.changed.emit($event || this.isGapChanged)
  }

  onGapChanged($event: boolean) {
    this.isGapChanged = $event
    this.changed.emit($event || this.isCountChanged)
  }

  updateFeatures(features: AnalysisFeatureModel[]) {
    const gapFeature = features.find(x => x.code == 'gap')
    this.updateFeature(gapFeature, this.gapSettings)

    const countFeature = features.find(x => x.code == 'count')
    this.updateFeature(countFeature, this.countSettings)
    this.logger.debug('setup analysis features and descriptions', this.gapSettings, this.countSettings)
  }

  updateFeature(feature: AnalysisFeatureModel | undefined, settings: AnyEventTypeAnalysisSettings | null){
    if (feature) {
      if (settings) {
        settings.is_disabled = false
        settings.description = feature.description ?? ''
      }
    } else {
      if (settings) {
        settings.is_disabled = true
      }
    }
  }

  parseAnalysisSettings() {
    this.gapSettings = null
    this.countSettings = null
    for (let analysis of this.settings) {
      switch (analysis.analysis_code) {
        case GAP_ANALYSIS_CODE: {
          this.gapSettings = analysis as EventTypeGapAnalysisSettings
          break
        }
        case COUNT_ANALYSIS_CODE: {
          this.countSettings = analysis as EventTypeGapAnalysisSettings
          break
        }
        default:
          this.logger.warn(`Unknown analysis code "${analysis.analysis_code}" for event-type id ${this.eventTypeId}`, analysis)
      }
    }
  }
}
