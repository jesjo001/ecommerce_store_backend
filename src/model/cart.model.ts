import mongoose from "mongoose";
import { SHIPPING_STATUS } from "../utils/Constants";

export interface CartDocument extends mongoose.Document {
    userId: string;
  userName: string;
  cartItems: Array<any>;
}

const Items = new mongoose.Schema(
    { 
        productName: {
            type: String,
            required: true, 
        },
        itemPrice: {
            type: String,
            required: true, 
        },
        isbn: {
            type: String,
            required: false, 
        },
        productId: {
            type: String,
            required: true, 
        },
        productImg: {
            type: String,
            required: false, 
        },
        quantity: {
            type: Number,
            required: true, 
        },
        shippingStatus: {
            type: String,
            required: false,
            enum: SHIPPING_STATUS
        },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    cartItems: {
      type: [Items],
      required: true,
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
export default Cart;
