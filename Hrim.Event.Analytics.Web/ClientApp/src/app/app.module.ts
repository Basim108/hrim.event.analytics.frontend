import {ErrorHandler, NgModule}              from '@angular/core';
import {BrowserModule}                       from '@angular/platform-browser';
import {BrowserAnimationsModule}             from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatIconModule}                       from '@angular/material/icon';
import {MatButtonModule}                     from "@angular/material/button";
import {AppRoutingModule}                    from "./app-routing.module";
import {MatDialogModule}                     from "@angular/material/dialog";
import {MatFormFieldModule}                  from "@angular/material/form-field";
import {MatInputModule}                      from "@angular/material/input";
import {ReactiveFormsModule}                 from "@angular/forms";

import {MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS, NgxMatColorPickerModule} from '@angular-material-components/color-picker'

import {AppComponent}           from './app.component';
import {HeaderComponent}        from './header/header.component';
import {FooterComponent}        from './footer/footer.component';
import {YearViewComponent}      from './year-view/year-view.component';
import {MonthViewComponent}     from './month-view/month-view.component';
import {DayOfMonthComponent}    from './month-view/day-of-month/day-of-month.component';
import {EventOfDayComponent}    from './month-view/day-of-month/event-of-day/event-of-day.component';
import {MonthPagesComponent}    from './month-view/month-pages/month-pages.component';
import {PageNotFoundComponent}  from './pages/page-not-found/page-not-found.component';
import {AuthMenuComponent}      from './auth-menu/auth-menu.component';
import {LandingViewComponent}   from './landing-view/landing-view.component';
import {EventTypeListComponent} from './event-type-list/event-type-list.component';
import {EventTypeItemComponent} from './event-type-item/event-type-item.component';

import {EventTypeDetailsDialog} from './dialogs/event-type-details-dialog/event-type-details-dialog.component';
import {ApiResponseInterceptor} from "./services/api-response-interceptor.service";
import {ErrorMetadataService}   from "./services/error-metadata.service";

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
    EventTypeItemComponent,
    EventTypeDetailsDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorMetadataService},
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
    {provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
