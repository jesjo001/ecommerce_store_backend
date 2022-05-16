import express from "express";
import multer from "multer";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    cartValidationRules,
    cartItemsValidationRules,
    validate,
} from "../../middleware/validation/validator";

import {
  createCartHandler,
  getCartHandler,
  incrementCartItemHandler,
  decrementCartItemHandler,
  clearCartItemsHandler,
  addToCartHandler,
} from "../../controller/cart.controller";

const CartRouter = express.Router();

CartRouter.use(requiresUser)
CartRouter.post("/create", cartValidationRules(), validate, createCartHandler)
CartRouter.get("/get", getCartHandler)
CartRouter.post("/increment", incrementCartItemHandler)
CartRouter.post("/decrement", decrementCartItemHandler)
CartRouter.post("/clear", clearCartItemsHandler)
CartRouter.post("/addtocart", cartItemsValidationRules(), validate, addToCartHandler)

export default CartRouter;