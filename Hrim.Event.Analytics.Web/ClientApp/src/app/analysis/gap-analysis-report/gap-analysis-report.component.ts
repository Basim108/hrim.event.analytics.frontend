import {Component, Input, OnInit} from '@angular/core';
import {GapAnalysisReport} from "../../shared/analysis-report.model";
import {ToHumanDurationOptions} from "luxon";

const DURATION_OPTION: ToHumanDurationOptions = { unitDisplay: "short" }

@Component({
  selector: 'gap-analysis-report',
  templateUrl: './gap-analysis-report.component.html',
  styleUrls: ['./gap-analysis-report.component.css']
})
export class GapAnalysisReportComponent implements OnInit {
  @Input() report: GapAnalysisReport | null
  displayedColumns: string[] = ['name', 'value'];
  dataSource: {name:string, value: string}[] = []

  constructor() { }

  ngOnInit(): void {
    this.dataSource.push({name: 'The shortest gap', value: this.report?.minGap.toHuman(DURATION_OPTION)!})
    this.dataSource.push({name: 'The date of the shortest gap', value: this.report?.minGapDate.toISODate()!})
    this.dataSource.push({name: 'The longest gap', value: this.report?.maxGap.toHuman(DURATION_OPTION)!})
    this.dataSource.push({name: 'The date of the longest gap', value: this.report?.maxGapDate.toISODate()!})
    this.dataSource.push({name: 'Average gap', value: this.report?.avgGap.toHuman(DURATION_OPTION)!})
    this.dataSource.push({name: 'The number of gaps', value: this.report?.gaps.toString()!})
    this.dataSource.push({name: 'The number of events', value: this.report?.events.toString()!})
  }
}
