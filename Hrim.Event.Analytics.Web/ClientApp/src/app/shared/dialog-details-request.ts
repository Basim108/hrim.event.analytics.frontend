import {HrimEntity} from "./hrim-entity";

export class DialogDetailsRequest<T extends HrimEntity> {
  title: string
  action: string

  constructor(public isEdit: boolean = false,
              public entity: T) {
    this.title = isEdit ? 'Edit' : 'Create';
    this.action = isEdit ? 'Save' : 'Create';
  }
}
