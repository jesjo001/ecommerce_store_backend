import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  createCart,
  findCart,
  findAllCart,
  findAndUpdate,
  deleteCart,
} from "../service/cart/cart.service";

export const createCartHandler = async (req: Request, res: Response) => {

    try {

        const userName = get(req, "body.userName");
        const cartItems = get(req, "body.cartItems");
        const userId = get(req, "user._id");

        const cartExists = await findCart({ userId }) 
        
        if(cartExists){
            return res.status(403).json({
                status: 403,
                message: "Cart already exists in our database",
            });
        }

        const newCart = await createCart({
            userName,
            userId,
            cartItems
        })

        return res.status(200).json({
            status: 200,
            cart: newCart
        });

    } catch(err){
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const getCartHandler = async (req: Request, res: Response) => {
    try {
      const userId = get(req, "user._id");
  
      const cart = await findCart({ userId });
  
      if (!cart)
        return res.status(404).json({
          status: 404,
          message: "Cart not found.",
        });
  
      return res.status(200).json({
        status: 200,
        cart,
      });
    } catch (err) {
      //log error with logger which doesn't block i/o like console.log does
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }
};


  export const incrementCartItemHandler = async (req: Request, res: Response) => {
    
    try {
      const productId = get(req, "body.productId");
      const userId = get(req, "user._id");
  
      const cart = await findAndUpdate({ userId, "cartItems.$.productId": productId }, {$inc:{"cartItems.$.quantity":1}}, { new:true });
  
      if (!cart) return res.status(404).json({
          status: 404,
          message: "Cart not found.",
      });

        
      return res.status(200).json({
        status: 200,
        cart,
      });
    } catch (err) {
      //log error with logger which doesn't block i/o like console.log does
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }
  };

  export const decrementCartItemHandler = async (req: Request, res: Response) => {
    try {
      const productId = get(req, "body.productId");
      const userId = get(req, "user._id");
  
      const cart = await findAndUpdate({ userId, "cartItems.$.productId": productId }, {$inc:{"cartItems.$.quantity":-1}}, { new:true });
  
      if (!cart) return res.status(404).json({
          status: 404,
          message: "Cart not found.",
      });

        
      return res.status(200).json({
        status: 200,
        cart,
      });
    } catch (err) {
      //log error with logger which doesn't block i/o like console.log does
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }
  };

  export const clearCartItemsHandler = async (req: Request, res: Response) => {
    try {
      const productId = get(req, "body.productId");
      const userId = get(req, "user._id");
  
      const cart = await findAndUpdate({ userId }, {$set:{ "cartItems":[] }}, { new:true });
  
      if (!cart) return res.status(404).json({
          status: 404,
          message: "Cart not found.",
      });

        
      return res.status(200).json({
        status: 200,
        cart,
      });
    } catch (err) {
      //log error with logger which doesn't block i/o like console.log does
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }
  };

  export const addToCartHandler = async (req: Request, res: Response) => {
    try {
      const productId = get(req, "body.productId");
      const update = req.body;
      const userId = get(req, "user._id");
      const user = get(req, "user");
  
      const cart = await findCart({ userId });
      
      if (!cart){

        const newCart = await createCart({
          userName: user.username,
          userId,
          cartItems: []
        })

        if(update.quantity === undefined ) update.quantity = 1

        const newCartItem = await findAndUpdate({userId},{ $push : { cartItems: update }}, { new: true, upsert: true })
          
        return res.status(200).json({
          status: 200,
          cart: newCartItem,
        });
      }

      if(cart.cartItems.length === 0){
        if(update.quantity === undefined ) update.quantity = 1

        const newCartItem = await findAndUpdate({userId},{ $push : { cartItems: update }}, { new: true, upsert: true })
        return res.status(200).json({
          status: 200,
          cart: newCartItem,
        });
      }

      const product = cart.cartItems.filter((item, index) => {
          return item.productId === productId;
      })

      if(product.length === 0){
        const newCartItem = await findAndUpdate({userId},{ $push : { cartItems: update }}, { new: true, upsert: true })
        return res.status(200).json({
          status: 200,
          cart: newCartItem,
        });
      }

      if(product.length > 0){
        if(update.quantity === undefined ) update.quantity = product[0].quantity++;
      }
      
      if(update.quantity !== undefined ) {
        
      }

      const updatedCart = await findAndUpdate(
          { userId, "cartItems.productId": productId }, 
          {$set:{"cartItems.$.quantity": update.quantity}}, 
          { new:true }
      );
  
      return res.status(200).json({
        status: 200,
        cart:updatedCart
      });
    } catch (err) {
      //log error with logger which doesn't block i/o like console.log does
      log.error(err);
      return res.status(500).json({
        status: 500,
        message: "Ops something went wrong. Please try again later!!",
      });
    }
  };