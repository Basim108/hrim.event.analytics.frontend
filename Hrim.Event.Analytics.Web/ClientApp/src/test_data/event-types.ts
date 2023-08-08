import {UserEventType} from "../app/shared/event-type.model";
import {EventTypeService} from "../app/services/user-event-type.service";

export class EventTypeTestData {
  public readonly reading: UserEventType
  public readonly yogaPractice: UserEventType
  public readonly successfulTroubleshooting: UserEventType
  public readonly badSleep: UserEventType

  constructor() {
    this.reading                   = {
      id              : "8087918a-1cb4-4b54-8a5d-86aec26025ea",
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
      "id"            : "dbbb1326-0b69-4b1b-a54a-25bcc4b07bb5",
      "name"          : "Yoga Practice",
      "color"         : "#ee00ee",
      description     : "",
      is_deleted      : false,
      concurrent_token: 1,
      "is_mine"       : true,
      analysis_results: [],
      analysisReports: null
    }
    this.successfulTroubleshooting = {
      "id"            : "f8034fca-780d-4874-8b8a-8f04a608a435",
      "name"          : "Successful Troubleshooting",
      "description"   : "when I successful figured out a reason of a failure",
      "color"         : "#7f98f5",
      is_deleted      : false,
      concurrent_token: 1,
      "is_mine"       : true,
      analysis_results: [],
      analysisReports: null
    }
    this.badSleep                  = {
      "id"            : "ed22a207-e9e9-4f3e-8f1c-7e8a269d3448",
      "name"          : "Bad sleep",
      "description"   : "when I had a sleepless night.",
      "color"         : "#35e536",
      is_deleted      : false,
      concurrent_token: 1,
      "is_mine"       : true,
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

