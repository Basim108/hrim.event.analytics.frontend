import {BaseDetailsDialogRequest} from "./base-details-dialog-request";
import {DurationEventModel}       from "../duration-event.model";
import {EventSaveContext}         from "../../dialogs/base-event-details-dialog";

export class DurationEventDetailsDialogRequest extends BaseDetailsDialogRequest {
  constructor(public model: DurationEventModel,
              isEdit: boolean = false) {
    const title = isEdit
                  ? 'Edit an duration event'
                  : 'Create a new duration of events'
    super(title, isEdit)
  }
}
