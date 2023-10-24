import { Brand } from "../domain/brand";
import { BrandName } from "../domain/name";

export interface BrandRepository {
  save(brand: Brand): Promise<Brand>;
  existsByBrandName(brandName: BrandName): Promise<boolean>;
  existsById(brandId: number): Promise<boolean>;
}
