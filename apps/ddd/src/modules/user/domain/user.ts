import {Entity, EntityClass} from "@ddd/shared/domain";

interface UserProps {
  email: string;
  username: string;
  password: string;
}

@Entity
class User extends EntityClass<UserProps> {

  constructor(props: UserProps) {
    super(props)
  }
}
