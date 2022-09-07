import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {YearViewComponent} from './year-view/year-view.component';
import {MonthViewComponent} from './month-view/month-view.component';
import {DayOfMonthComponent} from './month-view/day-of-month/day-of-month.component';
import {EventOfDayComponent} from './month-view/day-of-month/event-of-day/event-of-day.component';
import {MonthPagesComponent} from './month-view/month-pages/month-pages.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import { AuthMenuComponent } from './auth-menu/auth-menu.component';
import { LandingViewComponent } from './landing-view/landing-view.component';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import { EventTypeItemComponent } from './event-type-item/event-type-item.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    YearViewComponent,
    MonthViewComponent,
    DayOfMonthComponent,
    EventOfDayComponent,
    MonthPagesComponent,
    PageNotFoundComponent,
    AuthMenuComponent,
    LandingViewComponent,
    EventTypeListComponent,
    EventTypeItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
