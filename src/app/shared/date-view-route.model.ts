import {DateTime} from "luxon";
import {Params} from "@angular/router";

export abstract class DateViewRouteModel {
  format: string;
  path: string;
  paramName: string;
  configPath: string;
  lastSuccessfulDate: DateTime | null;

  protected constructor(path: string, format: string) {
    this.paramName = 'date';
    this.path = path;
    this.format = format;
    this.configPath = `${this.path}/:${this.paramName}`;
  }

  getRouteString(date: DateTime): string {
    return `${this.path}/${date.toFormat(this.format)}`;
  }

  getDateFromParams(params: Params): DateTime | null {
    const dateStr = params[this.paramName];
    const date = DateTime.fromFormat(dateStr, this.format);
    if (date.invalidReason) {
      return null;
    }
    return date;
  }
}
