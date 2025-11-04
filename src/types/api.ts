import type { ProductLite } from "./product";

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ProductsListResponse = {
  products: ProductLite[];
  pagination: Pagination;
};

export type ProductResponse = ProductLite;
