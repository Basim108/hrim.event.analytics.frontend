import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AnyEventTypeAnalysisSettings,
  EventTypeCountAnalysisSettings,
  EventTypeGapAnalysisSettings
} from "../../shared/event-type-analysis-settings";
import {LogService} from "../../services/log.service";
import {AnalysisSettingService} from "../../services/analysis-setting.service";
import {COUNT_ANALYSIS_CODE, GAP_ANALYSIS_CODE} from "../../shared/analysis-feature.model";

@Component({
  selector   : 'event-type-analysis-settings',
  templateUrl: './event-type-analysis-settings.component.html',
  styleUrls  : ['./event-type-analysis-settings.component.css']
})
export class EventTypeAnalysisSettingsComponent implements OnInit {
  @Input('eventTypeId') eventTypeId: string
  @Input('settings') settings: AnyEventTypeAnalysisSettings[]
  @Output() changed = new EventEmitter<boolean>()

  isCountChanged: boolean = false
  isGapChanged: boolean = false

  countSettings: EventTypeCountAnalysisSettings | null
  gapSettings: EventTypeGapAnalysisSettings | null

  constructor(private logger: LogService) {
    logger.logConstructor(this)
  }

  ngOnInit(): void {
    this.parseAnalysisSettings()
  }

  onCountChanged($event: boolean) {
    this.isCountChanged = $event
    this.changed.emit($event || this.isGapChanged)
  }

  onGapChanged($event: boolean) {
    this.isGapChanged = $event
    this.changed.emit($event || this.isCountChanged)
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
