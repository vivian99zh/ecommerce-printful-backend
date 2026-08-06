import { z } from 'zod/v4';
import { commonSchemas } from '#schemas';

const ProductImageSchema = z.object({
  id: commonSchemas.id,
  src: z.string().url(),
  name: z.string().optional(),
  alt: z.string().optional(),
  position: z.number().optional()
});

const ProductCategorySchema = z.object({
  id: commonSchemas.id,
  name: z.string(),
  slug: z.string(),
  parent: z.number().optional()
});

const ProductAttributeSchema = z.object({
  id: commonSchemas.id,
  name: z.string(),
  slug: z.string(),
  options: z.array(z.string()),
  position: z.number().optional(),
  variation: z.boolean().default(false),
  visible: z.boolean().default(true)
});

export const ProductSchema = z.object({
  id: commonSchemas.id,
  name: z.string(),
  slug: z.string(),
  permalink: z.string().url().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.string().optional(),
  regular_price: z.string().optional(),
  sale_price: z.string().optional(),
  price_html: z.string().optional(),
  categories: z.array(ProductCategorySchema).optional(),
  images: z.array(ProductImageSchema).optional(),
  attributes: z.array(ProductAttributeSchema).optional(),
  variations: z.array(commonSchemas.id).optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
  stock_quantity: z.number().nullable().optional(),
  rating_count: z.number().optional(),
  average_rating: z.string().optional(),
  reviews_allowed: z.boolean().optional(),
  date_created: z.string().optional(),
  date_modified: z.string().optional(),
  type: z.string().default('simple'),
  status: z.enum(['draft', 'pending', 'private', 'publish']).default('publish'),
  featured: z.boolean().default(false),
  on_sale: z.boolean().default(false),
  purchasable: z.boolean().default(true),
  total_sales: z.number().default(0)
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  pagination: z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    perPage: z.number()
  })
});

export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  type: z.enum(['simple', 'variable', 'grouped', 'external']).default('simple'),
  regular_price: z.string().optional(),
  sale_price: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  categories: z.array(z.number()).optional(),
  images: z
    .array(
      z.object({
        src: z.string().url(),
        position: z.number().optional()
      })
    )
    .optional(),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
        variation: z.boolean().default(false)
      })
    )
    .optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).default('instock'),
  stock_quantity: z.number().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'private', 'publish']).default('draft')
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
