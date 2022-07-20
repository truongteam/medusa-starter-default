import { Router } from 'express'
import { ClerkController } from './controllers/clerk';
import { ProductReviewController } from "./controllers/product-review";
import { ProductVariantController } from "./controllers/product-variant";

export default () => {
  const router = Router()
  new ProductReviewController(router);
  new ProductVariantController(router);
  new ClerkController(router);
  return router;
}