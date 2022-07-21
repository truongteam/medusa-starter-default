import { Application, Router } from 'express'
import { ClerkController } from './controllers/clerk';
import { ProductReviewController } from "./controllers/product-review";
import { ProductVariantController } from "./controllers/product-variant";

export default () => {
  const router = Router()
  const controller  = new ClerkController(router);
  return controller.getRouter();
}