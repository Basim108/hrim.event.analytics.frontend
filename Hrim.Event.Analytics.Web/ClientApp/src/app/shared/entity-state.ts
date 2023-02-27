export class EntityState<T> {
  isDeleted: boolean = false
  isModified: boolean = false
  isUnsaved: boolean = false

  entity: T
}
