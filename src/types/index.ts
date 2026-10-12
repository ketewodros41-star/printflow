// ─── Core platform types ────────────────────────────────────

export type Role = 'MERCHANT' | 'ADMIN' | 'PROVIDER' | 'CUSTOMER'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatarUrl?: string
  createdAt: Date
}

// ─── Catalog ───────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  productCount: number
}

export interface ProductVariant {
  id: string
  size: string
  color: string
  colorHex: string
  cost: number         // production cost in ETB
  stock: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

export interface PrintArea {
  id: string
  name: 'front' | 'back' | 'sleeve_left' | 'sleeve_right' | 'neck_inner' | 'neck_outer'
  width: number        // mm
  height: number       // mm
}

export interface CatalogProduct {
  id: string
  title: string
  categoryId: string
  categoryName: string
  brand: string
  sku: string
  description: string
  images: string[]
  variants: ProductVariant[]
  printAreas: PrintArea[]
  basePrice: number    // minimum production cost ETB
  printMethod: 'DTG' | 'EMBROIDERY' | 'SUBLIMATION' | 'SCREEN_PRINT'
  providerIds: string[]
  isChoice: boolean    // "Printify Choice" equivalent
  rating: number
  tags: string[]
}

// ─── Design & Product ──────────────────────────────────────

export interface DesignElement {
  id: string
  type: 'image' | 'text' | 'graphic'
  src?: string
  text?: string
  fontFamily?: string
  fontSize?: number
  color?: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface Design {
  id: string
  productId: string   // catalog product
  printAreaId: string
  elements: DesignElement[]
  mockupUrl?: string
  createdAt: Date
}

export type ProductStatus = 'DRAFT' | 'READY' | 'PUBLISHING' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED'

export interface MerchantProduct {
  id: string
  merchantId: string
  catalogProductId: string
  title: string
  description: string
  status: ProductStatus
  designs: Design[]
  variants: MerchantVariant[]
  mockupUrls: string[]
  storeId?: string
  externalId?: string  // ID in connected store
  createdAt: Date
  updatedAt: Date
}

export interface MerchantVariant {
  id: string
  catalogVariantId: string
  size: string
  color: string
  colorHex: string
  retailPrice: number  // ETB set by merchant
  productionCost: number
  shippingCost: number
  profit: number
  isEnabled: boolean
}

// ─── Orders ────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING' | 'PAID' | 'IMPORTED' | 'PROCESSING'
  | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED'
  | 'CANCELLED' | 'FAILED'

export interface OrderItem {
  id: string
  merchantProductId: string
  title: string
  variantLabel: string // "M / Black"
  quantity: number
  unitPrice: number
  productionCost: number
  shippingCost: number
  mockupUrl: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  region: string
  country: string
  postalCode?: string
}

export interface Order {
  id: string
  orderNumber: string
  merchantId: string
  customerId?: string
  storeId?: string
  items: OrderItem[]
  status: OrderStatus
  shippingAddress: ShippingAddress
  subtotal: number
  shippingTotal: number
  totalAmount: number
  paymentMethod: 'CHAPA' | 'MPESA' | 'TELEBIRR' | 'COD'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentRef?: string
  providerId?: string
  trackingNumber?: string
  carrier?: string
  shippedAt?: Date
  deliveredAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Payment Providers ────────────────────────────────────

export interface ChapaPaymentRequest {
  amount: number
  currency: 'ETB'
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  tx_ref: string
  callback_url: string
  return_url: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
}

export interface ChapaPaymentResponse {
  message: string
  status: 'success' | 'failed'
  data?: {
    checkout_url: string
  }
}

export interface MpesaSTKRequest {
  BusinessShortCode: string
  Password: string
  Timestamp: string
  TransactionType: 'CustomerPayBillOnline'
  Amount: number
  PartyA: string   // customer phone
  PartyB: string   // business shortcode
  PhoneNumber: string
  CallBackURL: string
  AccountReference: string
  TransactionDesc: string
}

export interface TelebirrPaymentRequest {
  appid: string
  merch_code: string
  nonce_str: string
  notify_url: string
  out_trade_no: string
  total_amount: string
  trans_currency: 'ETB'
  subject: string
  timeout_express: string
  timestamp: string
  sign: string
}

// ─── Print Providers ──────────────────────────────────────

export interface PrintProvider {
  id: string
  name: string
  location: string    // e.g. "Addis Ababa, Ethiopia"
  rating: number
  productCount: number
  avgProductionDays: number
  avgShippingDays: number
  printMethods: string[]
  isActive: boolean
  logoUrl?: string
}

// ─── Stores / Channels ────────────────────────────────────

export type StoreType = 'HOSTED' | 'SHOPIFY' | 'ETSY' | 'WOOCOMMERCE' | 'AMAZON' | 'MANUAL'

export interface Store {
  id: string
  merchantId: string
  name: string
  type: StoreType
  url?: string
  isConnected: boolean
  productCount: number
  orderCount: number
  connectedAt?: Date
}

// ─── Billing / Plans ──────────────────────────────────────

export type PlanTier = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'

export interface Plan {
  id: PlanTier
  name: string
  priceMonthly: number   // ETB
  priceAnnual: number    // ETB per month billed annually
  features: string[]
  productionDiscount: number  // % off production costs
  maxProducts: number | null  // null = unlimited
  maxStores: number
}
