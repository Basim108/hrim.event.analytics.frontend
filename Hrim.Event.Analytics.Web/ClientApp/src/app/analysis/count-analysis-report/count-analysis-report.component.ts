import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CountAnalysisReport} from "../../shared/analysis-report.model";
import {ToHumanDurationOptions} from "luxon";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

const DURATION_OPTION: ToHumanDurationOptions = { unitDisplay: "short" }

@Component({
  selector: 'count-analysis-report',
  templateUrl: './count-analysis-report.component.html',
  styleUrls: ['./count-analysis-report.component.css']
})
export class CountAnalysisReportComponent implements OnInit {
  @Input() report: CountAnalysisReport | null
  displayedColumns: string[] = ['name', 'value'];
  dataSource: MatTableDataSource<{name:string, value: string}> = new MatTableDataSource<{name: string; value: string}>([])

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource.data.push({name: 'Sum of all duration events', value: this.report?.totalDuration.toHuman(DURATION_OPTION)!})
    this.dataSource.data.push({name: 'Number of duration events', value: this.report?.durations.toString()!})
    this.dataSource.data.push({name: 'Number of occurrence events', value: this.report?.occurrences.toString()!})
    this.dataSource.data.push({name: 'Number of all events', value: (this.report?.occurrences! + this.report?.durations!).toString()!})
    this.dataSource.data.push({name: 'Average duration event length', value: this.report?.avgDuration.toHuman(DURATION_OPTION)!})
    this.dataSource.data.push({name: 'The shortest duration event', value: this.report?.minDuration.toHuman(DURATION_OPTION)!})
    this.dataSource.data.push({name: 'Date of the shortest event', value: this.report?.minDurationDate.toISODate()!})
    this.dataSource.data.push({name: 'The longest duration event', value: this.report?.maxDuration.toHuman(DURATION_OPTION)!})
    this.dataSource.data.push({name: 'Date of the longest event', value: this.report?.maxDurationDate.toISODate()!})
  }
}
