import {DateViewRouteModel} from "./date-view-route.model";

export class YearViewRouteModel extends DateViewRouteModel {
  constructor() {
    super('year', 'yyyy');
  }
}
