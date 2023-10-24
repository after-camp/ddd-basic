import { Entity, EntityClass } from "@ddd/shared/domain";
import { BrandName } from "./name";
import { BrandCommission } from "./commision";
import { BrandRegistrationNumber } from "./registrationNumber";

interface BrandProps {
  id?: number;
  name: BrandName;
  commission: BrandCommission;
  registrationNumber: BrandRegistrationNumber;
}

@Entity
export class Brand extends EntityClass<BrandProps> {
  constructor(props: BrandProps) {
    super(props);
  }
}
