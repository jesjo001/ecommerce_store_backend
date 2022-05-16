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
import fs from 'fs';
import util from 'util';

import uploadFile , { getFileStream } from "../s3"
import { profileEnd } from "console";

const unlinkFile = util.promisify(fs.unlink)

export const createProductHandler = async (req: Request, res: Response) => {

    try {

        const userId = get(req, "user._id");
        const userRole = get(req, "user.role");
        const body = req.body;

        if (String(userRole) !== "admin" ) {
          if(String(userRole) !== "seller") return res.status(401).json({
                status: 401,
                message:
                  "You do not have the required permissions to create a product.",
              });
        }

        body.sellerId = userId;
        body.image = "";

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

export const getImageHandler = async (req: Request, res: Response) => {

  try {

      const file = req.file;
      const userId = get(req, "user._id");
      const userRole = get(req, "user.role");
      const key = get(req, "params.key");

      const readStream = getFileStream(key);
      readStream.pipe(res) 

  } catch (err) {
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
  }
}

export const productImageUploadHandler = async (req: Request, res: Response) => {

  try {

      const file = req.file;
      const userId = get(req, "user._id");
      const userRole = get(req, "user.role");
      const productId = get(req, "body.productId");

      console.log(file)
      console.log("productId >> ", productId)

      const result = await uploadFile(file)
      console.log("result >> ", result)
      const imageUrl = `/images/${result.Key}`

      // const body = req.body;
      const product = await findProduct({ _id: productId})

      if(!product){  
        if(file) await unlinkFile(file.path)
        return res.status(401).json({
          status: 401,
          message: "Product not Found!!!",
        });
      }
        
      if (String(userRole) !== "admin" && userId !== product.sellerId ) {

        if(file) await unlinkFile(file.path)

          return res.status(401).json({
              status: 401,
              message:
                "You do not have the required permissions to upade this product.",
            });
      }

      const updateProduct = await findAndUpdate({ _id: productId}, { $set : { image: imageUrl} }, { new: true})
      if(file) await unlinkFile(file.path)

      return res.status(201).json({
        status: 201,
        product: updateProduct
      });
      // res.send("uploaded")
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

        if (String(userRole) !== "admin" && String(userRole) !== "seller" ) {
            return res.status(401).json({
                status: 401,
                message:
                  "You do not have the required permissions to update this product.",
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

      const page = parseInt(get(req, "query.page")) || 1;
      const limit = parseInt(get(req, "query.limit")) || 100;
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

