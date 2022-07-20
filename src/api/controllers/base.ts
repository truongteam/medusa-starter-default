import express, { Request, Router } from 'express';

export abstract class BaseController {
    protected router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.router.use(express.json())
    }

    getRouter(): Router {
        return this.router;
    }
}