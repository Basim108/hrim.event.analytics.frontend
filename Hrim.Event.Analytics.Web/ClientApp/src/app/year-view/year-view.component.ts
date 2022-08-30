import { Component, OnInit } from '@angular/core';
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-year-view',
  templateUrl: './year-view.component.html',
  styleUrls: ['./year-view.component.css']
})
export class YearViewComponent implements OnInit {

  constructor(private logger: LogService) {
    logger.debug('YearViewComponent constructor')
  }

  ngOnInit(): void {
  }

}
