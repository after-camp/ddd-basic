import { BrandRepository } from "./brandRepository";
import { Brand } from "../domain/brand";
import { drizzle } from "drizzle-orm/node-postgres";
import { dbPool } from "../../../infra/pool";
import { brandTable } from "../../../infra/db/brands";
import { BrandName } from "../domain/name";

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

    return b !== undefined;
  }
}
