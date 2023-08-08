import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from '@angular-material-components/color-picker'

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {YearViewComponent} from './year-view/year-view.component';
import {MonthViewComponent} from './month-view/month-view.component';
import {DayOfMonthComponent} from './month-view/day-of-month/day-of-month.component';
import {EventOfDayComponent} from './month-view/day-of-month/event-of-day/event-of-day.component';
import {MonthPagesComponent} from './month-view/month-pages/month-pages.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {AuthMenuComponent} from './auth-menu/auth-menu.component';
import {LandingViewComponent} from './landing-view/landing-view.component';
import {EventTypeListComponent} from './event-type-list/event-type-list.component';
import {EventTypeItemComponent} from './event-type-item/event-type-item.component';
import {ApiResponseInterceptor} from "./services/api-response-interceptor.service";
import {ErrorMetadataService} from "./services/error-metadata.service";
import {MatMenuModule} from "@angular/material/menu";
import {EventTypeDetailsDialog} from './dialogs/event-type-details-dialog/event-type-details-dialog.component';
import {OccurrenceEventDetailsDialog} from './dialogs/occurrence-event-details-dialog/occurrence-event-details-dialog';
import {DurationEventDetailsDialog} from './dialogs/duration-event-details-dialog/duration-event-details-dialog';
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ApiRequestInterceptor} from "./services/api-request-interceptor.service";
import {
  EventTypeAnalysisSettingsComponent
} from './analysis/event-type-analysis-settings/event-type-analysis-settings.component';
import {MatTabsModule} from "@angular/material/tabs";
import {GapAnalysisSettingsComponent} from './analysis/gap-analysis-settings/gap-analysis-settings.component';
import {CountAnalysisSettingsComponent} from './analysis/count-analysis-settings/count-analysis-settings.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {
  EventTypeAnalysisReportsComponent
} from './analysis/event-type-analysis-reports/event-type-analysis-reports.component';
import {CountAnalysisReportComponent} from './analysis/count-analysis-report/count-analysis-report.component';
import {GapAnalysisReportComponent} from './analysis/gap-analysis-report/gap-analysis-report.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";

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
    EventTypeDetailsDialog,
    OccurrenceEventDetailsDialog,
    DurationEventDetailsDialog,
    EventTypeAnalysisSettingsComponent,
    GapAnalysisSettingsComponent,
    CountAnalysisSettingsComponent,
    EventTypeAnalysisReportsComponent,
    CountAnalysisReportComponent,
    GapAnalysisReportComponent
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
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers   : [
    {provide: ErrorHandler, useClass: ErrorMetadataService},
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
    {provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptor, multi: true},
  ],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
