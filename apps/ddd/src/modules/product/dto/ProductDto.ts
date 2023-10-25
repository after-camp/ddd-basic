export class ProductDto {
  public id: number;

  public name: string;

  public price: number;

  public stock: number;
  public brandName: string;

  constructor({
    id,
    name,
    price,
    stock,
    brandName
  }: {
    id: number;
    name: string;
    price: number;
    stock: number;
    brandName: string;
  }) {
    this.brandName = brandName;
    this.stock = stock;
    this.price = price;
    this.name = name;
    this.id = id;
  }
}
