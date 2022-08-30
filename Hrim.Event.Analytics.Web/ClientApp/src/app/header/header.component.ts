import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteService} from "../services/route.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAuthenticatedSub: Subscription;

  constructor(private routeService: RouteService,
              private authService: AuthService,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnInit(): void {
    this.isAuthenticatedSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user);
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
  }

  navigateToMonthView() {
    if (!this.isMonthViewActive())
      this.routeService.navigateToLastSuccessfulMonth();
  }

  isMonthViewActive() {
    return window.location.href.indexOf(this.routeService.monthView.path) > -1;
  }
}
