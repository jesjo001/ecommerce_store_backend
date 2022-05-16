import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const userValidationRules = () => {
  return [
    // username must not be empty
    body("username").not().isEmpty(),
    // firstName is required
    body("firstName").not().isEmpty(),
    // lastName is required
    body("lastName").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const studentValidationRules = () => {
  return [
    // counselorId must not be empty
    body("counselorId").not().isEmpty(),
    // organizationId is required
    body("organizationId").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // sex is required
    body("sex").not().isEmpty(),
    // grade is required
    body("grade").not().isEmpty(),
    // role is required
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const eventValidationRules = () => {
  return [
    // eventName must not be empty
    body("eventName").not().isEmpty(),
    // createdBy is required
    body("createdBy").not().isEmpty(),
    // organizationId is required
    body("organizationId").not().isEmpty(),
    // thumbNail is required
    body("thumbNail").not().isEmpty(),
    // backgroundImage is required
    body("backgroundImage").not().isEmpty(),
    // description is required
    body("description").not().isEmpty(),
    //attendees email
    body("date").not().isEmpty().isDate(),
  ];
};

export const cartValidationRules = () => {
  return [
    // userId must not be empty
    body("userId").not().isEmpty(),
    // userName is required
    body("userName").not().isEmpty(),
    // cartItems is required
    body("cartItems").isArray(),    
  ];
};

export const cartItemsValidationRules = () => {
  return [
    // productName must not be empty
    body("productName").not().isEmpty(),
    // itemPrice is required
    body("itemPrice").not().isEmpty(),
    // isbn is required
    body("isbn").not().isEmpty(),
    // productId is required
    body("productId").not().isEmpty(),
    // productImg is required
    body("productImg").not().isEmpty(),
    // quantity is required
    body("quantity").isNumeric(),    
    // shippingStatus is required
    body("shippingStatus").not().isEmpty(),    
  ];
};

export const prooductValidationRule = () => {
  return [
    // name must not be empty
    body("name").not().isEmpty(),
    // price is required
    body("price").not().isEmpty(),
    // amount is required
    body("amount").not().isEmpty(),
    //validation description
    body("description").not().isEmpty(),
    // password must be at least 5 chars long
  ];
};

export const counsellorValidationRules = () => {
  return [
    // username must not be empty
    body("username").not().isEmpty(),
    // firstName is required
    body("firstName").not().isEmpty(),
    // lastName is required
    body("lastName").not().isEmpty(),
    // organizationId must not be empty
    body("organizationId").not().isEmpty(),
    // dob is required
    body("dob").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // sex is required
    body("sex").not().isEmpty(),
    // role is required
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const organizationValidationRules = () => {
  return [
    // username must not be empty
    body("name").not().isEmpty(),
    // firstName is required
    body("country").not().isEmpty(),
    // type is required
    body("type").not().isEmpty(),
    // address must not be empty
    body("address").not().isEmpty(),
    // city must not be empty
    body("city").not().isEmpty(),
    // dob is required
    body("website").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // state is required
    body("state").not().isEmpty(),
    // role is required
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
  ];
};

export const postValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const storeValidationRules = () => {
  return [
    // storeName must not be empty
    body("storeName").not().isEmpty(),
    // userId is required
    body("userId").not().isEmpty().isString(),
    // isRegistered is required
    body("isRegistered").isBoolean(),
    // phoneNumber is required
    body("phoneNumber").not().isEmpty(),
    // email is required
    body("email").not().isEmpty(),
    // address is required
    body("address").not().isEmpty(),
    // city is required
    body("city").not().isEmpty(),
    // country is required
    body("country").not().isEmpty(),
    // countryCode is required
    body("countryCode").not().isEmpty(),
  ];
};


export const createPostValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const updateValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const sessionValidationRules = () => {
  return [
    //validation email
    body("username").not().isEmpty(),
    // password must be at least 8 chars long
    body("password").isLength({ min: 8 }),
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: any = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
