export interface Product {
  _id?: string;
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryStat {
  total_products: number;
  total_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  by_category: Array<{
    category: string;
    count: number;
    total_quantity: number;
  }>;
}

export interface CashDrawItem {
  id: number;
  date: string;
  product_id: string;
  product_name: string;
  productId?: string;
  productName?: string;
  quantity: number;
  price: number;
  total: number;
  return_qty: number;
  sold_qty: number;
  cost_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface CashDraw {
  date: string;
  items: CashDrawItem[];
  total: number;
  totalItems?: number;
  totalAmount?: number;
  total_quantity?: number;
  total_sold?: number;
  total_return?: number;
  total_cost?: number;
  total_margin?: number;
}

export interface SaleTransaction {
  id: number;
  date: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface SaleSummary {
  sales: SaleTransaction[];
  total_sales: number;
  total_quantity: number;
}

export interface Sale {
  id: number;
  date: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface SalesStats {
  today_total: number;
  today_count: number;
  month_total: number;
  month_count: number;
  all_time_total: number;
  all_time_count: number;
}

export interface BestSeller {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_sales: number;
}

export interface PeriodSale {
  period: string;
  total: number;
  quantity: number;
}
