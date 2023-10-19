import { Entity, EntityClass, Identifier } from "@ddd/shared/domain";
import { Email } from "./email";
import { Phone } from "./phone";
import { Username } from "./username";
import { Password } from "./password";

export interface UserProps {
  id?: number;
  email: Email;
  phone: Phone;
  username: Username;
  password: Password;
  accessToken?: string;
  refreshToken?: string;
}

@Entity
export class User extends EntityClass<UserProps> {
  constructor(props: UserProps) {
    super(props, new Identifier(props.id));
  }

  setAccessToken(accessToken: string, refreshToken: string) {
    this.props.accessToken = accessToken;
    this.props.refreshToken = refreshToken;
  }

  isLoggedIn() {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }
}
