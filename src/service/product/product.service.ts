import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Product, { ProductDocument } from '../../model/product.model'


export const creatProduct = async( 
    input: DocumentDefinition<ProductDocument>
) => {
    return await Product.create(input);
}

export const findProduct = async(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) => {
  return Product.findOne(query, {}, options);
}

export const countProduct = async(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
return Product.find(query).countDocuments({});
}

export const findProducts = async(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
return Product.find(query, {}, options);
}


export const findAllProduct = async() => {
    return Product.find({});
}

export const findAndUpdate = (
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions
  ) => {
    return Product.findOneAndUpdate(query, update, options);
  };
  
  export const deleteProduct = async (query: FilterQuery<ProductDocument>) => {
    return Product.deleteOne(query);
  }