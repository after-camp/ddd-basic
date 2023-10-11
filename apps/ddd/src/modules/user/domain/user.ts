import {Entity, EntityClass, Identifier} from "@ddd/shared/domain";
import {Email} from "./email";

export interface UserProps {
  id?: string;
  email: Email;
  phone: `${number}-${number}-${number}`;
  username: string;
  password: string;
}

@Entity
export class User extends EntityClass<UserProps> {
  constructor(props: UserProps) {
    super(props, new Identifier(props.id))
  }
}
