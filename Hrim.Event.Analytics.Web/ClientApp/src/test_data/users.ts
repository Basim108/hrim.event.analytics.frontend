import {UserProfileModel} from "../app/shared/user-profile.model";

export class TestUsers {
  public readonly john_doe: UserProfileModel

  constructor() {
    this.john_doe = {
      id         : 1,
      full_name  : "John Doe",
      picture_uri: "https://secure.gravatar.com/avatar/9b7e0f57-c8b8-4220-8269-f55d5a61bd91.jpg"
    }
  }
}
