import {Component, OnInit} from '@angular/core';
import {RouteService} from "../services/route.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private routeService: RouteService) {
    console.debug('HeaderComponent constructor');
  }

  ngOnInit(): void {
    console.debug('HeaderComponent ngOnInit');
    console.log(window.location.href);
  }

  navigateToMonthView() {
    console.debug('start handing navigateToMonthView')
    if (!this.isMonthViewActive())
      this.routeService.navigateToLastSuccessfulMonth();
  }

  isMonthViewActive() {
    return window.location.href.indexOf(this.routeService.monthView.path) > -1;
  }
}
