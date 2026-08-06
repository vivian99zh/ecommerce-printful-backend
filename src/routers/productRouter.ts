import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariations,
  getProductBySlug,
  getFeaturedProducts,
  getProductsOnSale,
  getProductsByCategory
} from '#controllers';
import { authenticate, validateBody } from '#middlewares';

import { ProductCreateSchema, ProductUpdateSchema } from '#schemas';

const productRouter = Router();

productRouter.get('/products', getProducts);
productRouter.get('/products/featured', getFeaturedProducts);
productRouter.get('/products/on-sale', getProductsOnSale);
productRouter.get('/products/category/:categoryId', getProductsByCategory);
productRouter.get('/products/slug/:slug', getProductBySlug);
productRouter.get('/products/:id', getProduct);
productRouter.get('/products/:id/variations', getProductVariations);
productRouter.post('/products', authenticate, validateBody(ProductCreateSchema), createProduct);
productRouter.put('/products/:id', authenticate, validateBody(ProductUpdateSchema), updateProduct);
productRouter.patch('/products/:id', authenticate, validateBody(ProductUpdateSchema), updateProduct);
productRouter.delete('/products/:id', authenticate, deleteProduct);

export default productRouter;
