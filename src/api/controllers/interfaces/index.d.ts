import { ProductReview } from "../../../models/product-review";
import { Request, Response } from 'express'
export interface IProductReviewService {
    getProductReviews (product_id: string): Promise<ProductReview>;
    addProductReview (product_id: string, data: any): Promise<ProductReview>;
}
export interface IProductOutstockVariantService {
    listAndCount(query: unknown): Promise<any>;
}
