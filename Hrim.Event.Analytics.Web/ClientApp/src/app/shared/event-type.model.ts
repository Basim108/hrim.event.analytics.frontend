import {HrimEntity} from "./hrim-entity";

export class UserEventType extends HrimEntity{
  name: string = ''
  description: string | null = ''
  color: string = ''
  is_deleted: boolean
  is_mine: boolean
}
