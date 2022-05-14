import { omit } from "lodash";
import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Cart, { CartDocument } from '../../model/cart.model';

export const createCart = async( 
    input: DocumentDefinition<CartDocument>
) => {
    return await Cart.create(input);
}

export const findCart = async(
    query: FilterQuery<CartDocument>,
    options: QueryOptions = { lean: true }
) => {
  return Cart.findOne(query, {}, options);
}

export const findAllCart = async() => {
    return Cart.find({});
}

export const findAndUpdate = (
    query: FilterQuery<CartDocument>,
    update: UpdateQuery<CartDocument>,
    options: QueryOptions
  ) => {
    return Cart.findOneAndUpdate(query, update, options);
  };
  
  export const deleteCart = async (query: FilterQuery<CartDocument>) => {
    return Cart.deleteOne(query);
  }