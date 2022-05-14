import express from 'express';
import { Request, Response } from 'express';
import UserRouter from './users/routes';
import PostRouter from './post/routes';
import ProductRouter from "./product/router";
import CartRouter from "./cart/router";
import StoreRouter from "./store/router"

const Router = express.Router();

Router.use('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

//Routes
Router.use('/user', UserRouter);
Router.use('/post', PostRouter);
Router.use("/product", ProductRouter);
Router.use("/cart", CartRouter);
Router.use("/store", StoreRouter);

export default Router;