import express from "express";
import multer from "multer";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    prooductValidationRule,
    prooductUpdateValidationRule,
    validate,
} from "../../middleware/validation/validator";

import {
  createProductHandler,
  updateProductHandler,
  findSingleProductHandler,
  findProductsHandler,
  deleteProductHandler,
  productImageUploadHandler,
  getImageHandler
} from "../../controller/product.controller";

const upload = multer({ dest: 'uploads/'})

const ProductRouter = express.Router();

ProductRouter.get("/get/:id", findSingleProductHandler );
ProductRouter.get("/get", findProductsHandler);

ProductRouter.use(requiresUser)
ProductRouter.post("/create", prooductValidationRule(), validate, createProductHandler);
ProductRouter.post("/upload", upload.single('image'), productImageUploadHandler);
ProductRouter.get("/images/:key", getImageHandler);
ProductRouter.post("/update", prooductUpdateValidationRule(), validate, updateProductHandler);


ProductRouter.use(requiresAdmin)
ProductRouter.delete("/delete/:id", deleteProductHandler);

export default ProductRouter;