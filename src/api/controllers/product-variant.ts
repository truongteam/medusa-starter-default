import { BaseController } from "./base";
import { NextFunction, Request, Response, Router } from 'express'
import adminCors from "../middlewares/admin-cors";
import handleJSON from "../middlewares/handle-json";
import { IProductOutstockVariantService } from "./interfaces";

export class ProductVariantController extends BaseController {
    private service: IProductOutstockVariantService;
    constructor(router) {
        super(router)
        this.router.options("/admin/outstock_variants", adminCors);
        this.router.get("/admin/outstock_variants", adminCors, this.resolveService.bind(this), this.getOutStockVariants.bind(this))
    }
    
    protected resolveService(req: Request) {
        this.service = req.scope.resolve('productOutstockVariantService')
    }

    private getOutStockVariants(req: Request, res: Response, next: NextFunction) {
        this.service.listAndCount(req.query)
        .then(handleJSON(res))
        .catch(next)
    }
}