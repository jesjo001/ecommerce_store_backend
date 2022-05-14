import express from "express";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";
import {
  storeValidationRules,
  validate,
} from "../../middleware/validation/validator";
import {
  createStoreHandler,
  updateStoreHandler,
  findStoreHandler,
  findAllStoreHandler,
  deleteStoreHandler,
} from "../../controller/store.controller";

const StoreRouter = express.Router();

StoreRouter.get("/get", findStoreHandler)
StoreRouter.get("/get/all", findAllStoreHandler)

StoreRouter.use(requiresUser);
StoreRouter.post("/create", storeValidationRules(), validate, createStoreHandler)
StoreRouter.post("/update", updateStoreHandler)
StoreRouter.post("/delete", deleteStoreHandler)

export default StoreRouter;