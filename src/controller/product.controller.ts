import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  creatProduct,
  findProduct,
  findAndUpdate,
  findAllProduct,
  deleteProduct,
  findProducts,
  countProduct

} from "../service/product/product.service";
import { profileEnd } from "console";

export const createProductHandler = async (req: Request, res: Response) => {

    try {

        const userId = get(req, "user._id");
        const userRole = get(req, "user.role");
        const body = req.body;

        if (String(userRole) !== "admin" || String(userRole) !== "seller" ) {
            return res.status(401).json({
                status: 401,
                message:
                  "You do not have the required permissions to create a product.",
              });
        }

        body.sellerId = userId;

        const product = await creatProduct({ ...body })

        return res.status(201).json({
          status: 201,
          product
        });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const updateProductHandler = async (req: Request, res: Response) => {

    try {
        const userId = get(req, "user._id");
        const userRole = get(req, "user.role");
        const body = req.body;

        if (String(userRole) !== "admin" || String(userRole) !== "seller" ) {
            return res.status(401).json({
                status: 401,
                message:
                  "You do not have the required permissions to create a product.",
              });
        }

        delete body.sellerId
        const updateProduct = await findAndUpdate({ _id: body.productId, sellerId: userId}, { ...body}, { new: true})
        
        return res.status(201).json({
          status: 201,
          product: updateProduct
        });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findSingleProductHandler = async (req: Request, res: Response) => {

    try {
      const productId = get(req, "params.id");
      const product = await findProduct({_id: productId, approved: true, deleted: false})
      
      return res.status(201).json({
        status: 201,
        product
      });
        
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findProductsHandler = async (req: Request, res: Response) => {

    try {
    
      const count = await countProduct({approved:true})

      const page = parseInt(get(req, "body.page")) || 1;
      const limit = parseInt(get(req, "body.limit")) || 100;
      const skipIndex = (page - 1) * limit;

      const products = await findProducts({approved: true, deleted:false},{ skip:skipIndex, limit})

      
      return res.status(201).json({
        status: 201,
        products,
        count
      });

    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const deleteProductHandler = async (req: Request, res: Response) => {

    try {
        
      const productId = get(req, "params.id");
      const product = await findAndUpdate({_id: productId}, { $set : {deleted: true} }, {new:true})

      return res.status(201).json({
        status: 201,
        message: "product deleted successfully",
        product
      });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

