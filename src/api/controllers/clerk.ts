import { ClerkExpressWithAuth, WithAuthProp, users } from '@clerk/clerk-sdk-node';
import { CustomerService } from '@medusajs/medusa';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from "./base";
import jwt from 'jsonwebtoken'
import { ConfigModule } from '@medusajs/medusa/dist/types/global';
import { storeMedusaCors } from '../middlewares/store-cors';

export class ClerkController extends BaseController {
    private customerService: CustomerService;
    private configModule: ConfigModule;
    constructor(args) {
        super(args)

        this.router.options('/store/clerk/auth', storeMedusaCors);
        this.router.get(
            '/store/clerk/auth',
            storeMedusaCors,
            this.resolveService.bind(this),
            ClerkExpressWithAuth(),
            this.handleAuth.bind(this)
        )
    }

    protected resolveService(req: Request, res: Response, next: NextFunction) {
        this.configModule = req.scope.resolve('configModule')
        this.customerService = req.scope.resolve('customerService')
        next()
    }

    async handleAuth(req: WithAuthProp<Request>, res: Response, next: NextFunction) {
        try {
            console.log(process.env.CLERK_API_KEY)
            console.log(req.auth)
            const { userId } = req.auth;
            const clerkUser = await users.getUser(userId)
            const email = clerkUser.emailAddresses[0].emailAddress
            console.log('email', email)
            const customer = await this.customerService.retrieveByEmail(email).catch(err => {
                console.log(err)
                return this.customerService.create({
                    email,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    has_account: true,
                    phone: clerkUser.phoneNumbers[0]?.phoneNumber,
                })
            })
            console.log('customer', customer)

            req.session.jwt = {}

            const jwt_secret = this.configModule.projectConfig.jwt_secret
            console.log(jwt_secret)

            req.session.jwt = jwt.sign({ customer_id: customer.id }, jwt_secret, {
                expiresIn: "30d",
            })

            return res.json({ data: customer })
        } catch (error) { return res.status(401).json({ error }) }
    }
}