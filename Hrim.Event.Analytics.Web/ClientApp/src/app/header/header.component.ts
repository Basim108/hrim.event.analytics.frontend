import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteService} from "../services/route.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Router} from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = true;
  isAuthenticatedSub: Subscription;

  constructor(private routeService: RouteService,
              private authService: AuthService,
              private router: Router,
              private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnInit(): void {
    this.isAuthenticatedSub = this.authService.user$.subscribe(user => this.isAuthenticated = !!user);
  }

  ngOnDestroy() {
    this.isAuthenticatedSub?.unsubscribe();
  }

  navigateToMonthView() {
    if (!this.isMonthViewActive())
      this.routeService.navigateToLastSuccessfulMonth();
  }

  isMonthViewActive() {
    // return window.location.href.indexOf(this.routeService.monthView.path) > -1;
    console.log('router.url is ', this.router.url)
    console.log('this.routeService.monthView.path is ', this.routeService.monthView.path)

    return this.router.url.indexOf(this.routeService.monthView.path) > -1;
  }
}
