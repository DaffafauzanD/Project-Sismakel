export class Product {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  category!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
} 