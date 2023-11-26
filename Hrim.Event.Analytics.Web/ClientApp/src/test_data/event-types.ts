import {UserEventType} from "../app/shared/event-type.model";
import {EventTypeService} from "../app/services/user-event-type.service";

export class EventTypeTestData {
  public readonly reading: UserEventType
  public readonly yogaPractice: UserEventType
  public readonly successfulTroubleshooting: UserEventType
  public readonly badSleep: UserEventType

  constructor() {
    this.reading                   = {
      id              : 1,
      parent_id       : 0,
      name            : "Reading",
      color           : "#bccbf7",
      description     : "",
      is_deleted      : false,
      concurrent_token: 1,
      is_mine         : true,
      analysis_results: [],
      analysisReports: null
    }
    this.yogaPractice              = {
      id              : 2,
      parent_id       : 0,
      name            : "Yoga Practice",
      color           : "#ee00ee",
      description     : "",
      is_deleted      : false,
      concurrent_token: 1,
      is_mine         : true,
      analysis_results: [],
      analysisReports: null
    }
    this.successfulTroubleshooting = {
      id              : 3,
      parent_id       : 0,
      name            : "Successful Troubleshooting",
      description     : "when I successful figured out a reason of a failure",
      color           : "#7f98f5",
      is_deleted      : false,
      concurrent_token: 1,
      is_mine         : true,
      analysis_results: [],
      analysisReports: null
    }
    this.badSleep                  = {
      id              : 4,
      parent_id       : 0,
      name            : "Bad sleep",
      description     : "when I had a sleepless night.",
      color           : "#35e536",
      is_deleted      : false,
      concurrent_token: 1,
      is_mine         : true,
      analysis_results: [],
      analysisReports: null
    }
  }

  register(service: EventTypeService) {
    service.registerEventType(this.reading)
    service.registerEventType(this.yogaPractice)
    service.registerEventType(this.successfulTroubleshooting)
    service.registerEventType(this.badSleep)
  }
}

