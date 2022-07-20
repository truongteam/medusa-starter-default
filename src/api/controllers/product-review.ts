import { IProductReviewService } from "./interfaces";
import { BaseController } from "./base";
import storeCors from "../middlewares/store-cors";
import { NextFunction, Request, Response } from 'express'
import adminCors from "../middlewares/admin-cors";
import handleJSON from "../middlewares/handle-json";

export class ProductReviewController extends BaseController {
    private productReviewService: IProductReviewService;

    public constructor(args) {
        super(args);
        this.router.get(
            "/store/products/:id/reviews", 
            storeCors, 
            this.resolveService.bind(this), 
            this.getProductReviews.bind(this)
        )
        this.router.options("/store/products/:id/reviews", storeCors);
        this.router.post(
            "/store/products/:id/reviews", 
            storeCors, 
            this.resolveService.bind(this), 
            this.addProductReview.bind(this)
        )
        this.router.options("/admin/products/:id/reviews", adminCors);
        this.router.get(
            "/admin/products/:id/reviews", 
            adminCors, 
            this.resolveService.bind(this), 
            this.getProductReviews.bind(this)
        )
    }

    protected resolveService(req: Request) {
        this.productReviewService = req.scope.resolve('productReviewService')
    }
    
    private async getProductReviews(req: Request, res: Response, next: NextFunction) {
        return this.productReviewService
            .getProductReviews(req.params.id)
            .then(handleJSON(res))
            .catch(next)
    }

    private async addProductReview(req: Request, res: Response, next: NextFunction) {
        this.productReviewService.addProductReview(req.params.id, req.body.data)
        .then(handleJSON(res))
        .catch(next)
    }
}
