import { Entity, UniqueEntityID } from "@ddd/shared/domain";
import { BrandName } from "./name";
import { BrandCommission } from "./commision";
import { BrandRegistrationNumber } from "./registrationNumber";
import { AggregateRoot } from "../../../../../../shared/src/lib/domain/AggregateRoot";
import { BrandDeleted } from "./event/brandDeleted";

interface BrandProps {
  id?: number;
  name: BrandName;
  commission: BrandCommission;
  registrationNumber: BrandRegistrationNumber;
}

@Entity
export class Brand extends AggregateRoot<BrandProps> {
  constructor(props: BrandProps) {
    super(props, new UniqueEntityID(props.id));
  }

  delete() {
    this.addDomainEvent(
      new BrandDeleted({
        id: this.props.id!,
      }),
    );
  }
}
