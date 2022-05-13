import express from "express";
import multer from "multer";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    prooductValidationRule,
  validate,
} from "../../middleware/validation/validator";

import {
  createProductHandler,
  updateProductHandler,
  findSingleProductHandler,
  findProductsHandler,
  deleteProductHandler
} from "../../controller/product.controller";

const upload = multer({ dest: 'uploads/'})

const ProductRouter = express.Router();

ProductRouter.use(requiresUser)
ProductRouter.post("/create", prooductValidationRule(), validate, upload.single('image'), createProductHandler);
ProductRouter.post("/update", prooductValidationRule(), validate, updateProductHandler);
ProductRouter.get("/get/:id", findSingleProductHandler );
ProductRouter.get("/get", findProductsHandler);

ProductRouter.use(requiresAdmin)
ProductRouter.delete("/delete/:id", deleteProductHandler);

export default ProductRouter;