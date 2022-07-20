import { ClerkExpressRequireAuth, WithAuthProp, users } from '@clerk/clerk-sdk-node';
import { CustomerService } from '@medusajs/medusa';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from "./base";
import jwt from 'jsonwebtoken'
import { ConfigModule } from '@medusajs/medusa/dist/types/global';
export class ClerkController extends BaseController {
    private customerService: CustomerService;
    private configModule: ConfigModule;
    constructor(args) {
        super(args)

        this.router.post(
            '/store/clerk/auth', 
            ClerkExpressRequireAuth,
            this.resolveService.bind(this),
            this.handleAuth.bind(this)
        )
    }

    protected resolveService(req: Request) {
        this.configModule = req.scope.resolve('configModule')
        this.customerService = req.scope.resolve('customerService')
    }

    async handleAuth(req: WithAuthProp<Request>, res: Response, next: NextFunction) {
        try {
            const { userId } = req.auth;
            const clerkUser = await users.getUser(userId)
            const email = clerkUser.emailAddresses[0].emailAddress
            const customer = await this.customerService.retrieveByEmail(email).catch(err => {
                return this.customerService.create({
                    email,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    has_account: true,
                    phone: clerkUser.phoneNumbers[0]?.phoneNumber,
                })
            })
            const jwt_secret = this.configModule.projectConfig.jwt_secret
            req.session.jwt = jwt.sign({ customer_id: customer.id }, jwt_secret!, {
                expiresIn: "30d",
            })
            res.json({ data: customer })
        } catch (error) { next(error) }
    }
}