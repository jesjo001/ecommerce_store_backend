import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  createStore,
  findStore,
  findAllStore,
  deleteStore,
  findAndUpdate,
  countStore,
  findStores
} from "../service/store/store.service";

export const createStoreHandler = async (req: Request, res: Response) => {

    try {
      const userId = get(req, "user._id");
      const body = req.body;

      delete body.approved
      delete body.deleted

      const store = await createStore({ ...body });
      
      return res.status(201).json({
        status: 201,
        store
      });

    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const updateStoreHandler = async (req: Request, res: Response) => {

    try {
        
        
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findStoreHandler = async (req: Request, res: Response) => {

    try {
      const storeId = get(req, "params.id");

      const store = await findStore({ _id: storeId });
  
      if (!store)
        return res.status(404).json({
          status: 404,
          message: "Store not found.",
        });
  
      return res.status(200).json({
        status: 200,
        store,
      });
        
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findAllStoreHandler = async (req: Request, res: Response) => {

    try {
      const count = await countStore({approved:true})

      const page = parseInt(get(req, "body.page")) || 1;
      const limit = parseInt(get(req, "body.limit")) || 100;
      const skipIndex = (page - 1) * limit;

      const store = await findStores({approved: true, deleted:false},{ skip:skipIndex, limit})

      return res.status(201).json({
        status: 201,
        store,
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

export const deleteStoreHandler = async (req: Request, res: Response) => {

    try {
        
      const storeId = get(req, "params.id");
      const store = await findAndUpdate({_id: storeId}, { $set : {deleted: true} }, {new:true})

      return res.status(201).json({
        status: 201,
        message: "store deleted successfully",
        store
      });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

