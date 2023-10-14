import {Entity, EntityClass, Identifier} from "@ddd/shared/domain";
import {Email} from "./email";
import { Phone } from "./phone";
import { Username } from "./username";
import { Password } from "./password";

export interface UserProps {
  id?: string;
  email: Email;
  phone: Phone;
  username: Username;
  password: Password;
}

@Entity
export class User extends EntityClass<UserProps> {
  constructor(props: UserProps) {
    super(props, new Identifier(props.id))
  }
}
