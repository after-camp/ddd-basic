import {Entity, EntityClass, Identifier} from "@ddd/shared/domain";

interface UserProps {
  id?: string;
  email: string;
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
