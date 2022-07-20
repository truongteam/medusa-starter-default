import { IsString, IsOptional, IsInt } from "class-validator";
import { BaseService } from "medusa-interfaces";
import { Type } from 'class-transformer'
import { validator } from "../utils/validator";
import { EntityManager, LessThanOrEqual } from "typeorm";
import { ProductVariantRepository } from "@medusajs/medusa/dist/repositories/product-variant";
import { ProductVariant } from "@medusajs/medusa";
import { FindConfig } from "@medusajs/medusa/dist/types/common";
import { IProductOutstockVariantService } from "../api/controllers/interfaces";
export class AdminGetVariantsParams {
    @IsString()
    @IsOptional()
    q?: string
  
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 20
  
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    offset?: number = 0
}

class ProductOutstockVariant extends BaseService implements IProductOutstockVariantService {
    private manager_: EntityManager
    private productVariantRepository_: typeof ProductVariantRepository
    constructor({ productVariantRepository, manager }) {
        super()
        this.productVariantRepository_ = productVariantRepository;
        this.manager_ = manager;
    }
    async listAndCount(query: unknown) {
        const { offset, limit, q } = await validator(
            AdminGetVariantsParams,
            query
        )
            
        return this.manager_.getCustomRepository(this.productVariantRepository_).findAndCount({
            where: {
                inventory_quantity: LessThanOrEqual(0)
            },
            skip: offset,
            take: limit
        })
    }
}

export default ProductOutstockVariant