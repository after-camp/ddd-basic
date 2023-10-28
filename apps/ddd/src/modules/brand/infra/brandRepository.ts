import { Brand } from "../domain/brand";
import { BrandName } from "../domain/name";

export interface BrandRepository {
  save(brand: Brand): Promise<Brand>;
  existsByBrandName(brandName: BrandName): Promise<boolean>;
  existsById(brandId: number): Promise<boolean>;
  getBrandsByIds(brandIds: number[]): Promise<Brand[]>;
  findById(id: number): Promise<Brand | undefined>;
  delete(brand: Brand): Promise<void>;
}
