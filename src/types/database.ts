export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type DiscountType = 'percentage' | 'fixed'

export interface User {
  id: string
  email: string
  password_hash: string | null
  name?: string
  phone?: string
  role: UserRole
  avatar_url?: string
  birth_date?: string
  gender?: string
  preferred_language?: string
  created_at: string
  updated_at: string
}
export interface UserAddress {
  id: string
  user_id: string
  label: string
  recipient_name: string
  recipient_phone: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}
export interface Category {
  id: string
  name_ko: string
  name_ru?: string
  name_en?: string
  slug: string
  image_url?: string
  description?: string
  created_at: string
}

export interface Brand {
  id: string
  name: string
  logo_url?: string
  created_at: string
}

export interface Product {
  id: string
  category_id?: string
  brand_id?: string
  name_ko: string
  name_ru?: string
  name_en?: string
  slug: string
  description_ko?: string
  description_ru?: string
  description_en?: string
  price: number
  discount_price?: number
  stock_quantity: number
  images: string[]
  nutrition_facts?: any
  ingredients?: string
  usage_instructions?: string
  rating: number
  reviews_count: number
  is_featured: boolean
  is_new: boolean
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
  reviews?: Review[]
}

export interface Order {
  id: string
  user_id?: string
  order_number: string
  status: OrderStatus
  total_amount: number
  discount_amount: number
  shipping_cost: number
  payment_method?: string
  payment_status: PaymentStatus
  shipping_address?: any
  customer_name: string
  customer_phone: string
  customer_email: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  quantity: number
  price: number
  subtotal: number
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id?: string
  rating: number
  comment?: string
  is_approved: boolean
  created_at: string
  user?: User
}

export interface PromoCode {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount: number
  usage_limit?: number
  used_count: number
  valid_from?: string
  valid_until?: string
  is_active: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}