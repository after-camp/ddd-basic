import { Brand } from "../domain/brand";

export interface BrandRepository {
  save(brand: Brand): Promise<Brand>;
}
