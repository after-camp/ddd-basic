import { BrandRepository } from "./brandRepository";
import { Brand } from "../domain/brand";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import { brandTable } from "../../../infra/db/brands";
import { BrandName } from "../domain/name";
import { undefined } from "effect/Match";
import { inArray } from "drizzle-orm";
import { BrandCommission } from "../domain/commision";
import { BrandRegistrationNumber } from "../domain/registrationNumber";

export class BrandRepositoryImpl implements BrandRepository {
  private db = drizzle(dbPool, {
    schema: { brands: brandTable },
  });

  async save(brand: Brand): Promise<Brand> {
    const newBrands = await this.db
      .insert(brandTable)
      .values({
        registrationNumber: brand.props.registrationNumber.props.value,
        commision: brand.props.commission.props.value,
        name: brand.props.name.props.value,
      })
      .returning();

    const newBrand = newBrands[0];
    return new Brand({
      id: newBrand.id,
      name: brand.props.name,
      commission: brand.props.commission,
      registrationNumber: brand.props.registrationNumber,
    });
  }

  async existsByBrandName(brandName: BrandName) {
    const b = await this.db.query.brands.findFirst({
      where: (brands, { eq }) => eq(brands.name, brandName.props.value),
    });

    return !!b;
  }

  async existsById(brandId: number) {
    const b = await this.db.query.brands.findFirst({
      where: (brands, { eq }) => eq(brands.id, brandId),
    });

    return !!b;
  }

  async getBrandsByIds(brandIds: number[]): Promise<Brand[]> {
    const bs = await this.db
      .select()
      .from(brandTable)
      .where(inArray(brandTable.id, brandIds));

    return bs.map(
      (b) =>
        new Brand({
          id: b.id,
          name: BrandName.unsafeCreate(b.name),
          commission: BrandCommission.unsafeCreate(b.commision),
          registrationNumber: BrandRegistrationNumber.unsafeCreate(
            b.registrationNumber,
          ),
        }),
    );
  }
}
