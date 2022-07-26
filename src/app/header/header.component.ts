import {Component, OnInit} from '@angular/core';
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthorized = false;
  isMonthViewActive = true;

  constructor(private logger: LogService) {
    logger.log('HeaderComponent constructor');
  }

  ngOnInit(): void {
    this.logger.log('HeaderComponent ngOnInit');
  }

  switchToMonthView(){
    this.isMonthViewActive = !this.isMonthViewActive;
  }
}
