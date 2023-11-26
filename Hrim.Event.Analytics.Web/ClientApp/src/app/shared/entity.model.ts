export abstract class EntityModel {
  id: number | string
  concurrentToken: number

  protected constructor(id: number | string, concurrentToken: number) {
    this.id              = id
    this.concurrentToken = concurrentToken
  }
}
