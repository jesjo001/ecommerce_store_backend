import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Store, { StoreDocument } from '../../model/store.model'


export const createStore = async( 
    input: DocumentDefinition<StoreDocument>
) => {
    return await Store.create(input);
}

export const findStore = async(
    query: FilterQuery<StoreDocument>,
    options: QueryOptions = { lean: true }
) => {
  return await Store.findOne(query, {}, options);
}

export const findAllStore = async() => {
    return Store.find({});
}
export const countStore = async(
  query: FilterQuery<StoreDocument>,
) => {
  return await Store.find(query).countDocuments({});
};

export const findStores = async(
  query: FilterQuery<StoreDocument>,
  options: QueryOptions,
  docLimit: number,
  skip: number
) => {
  return await Store.find(query).limit(docLimit).skip(skip);
};

export const findAndUpdate = async(
    query: FilterQuery<StoreDocument>,
    update: UpdateQuery<StoreDocument>,
    options: QueryOptions
  ) => {
    return await Store.findOneAndUpdate(query, update, options);
  };
  
  export const deleteStore = async (query: FilterQuery<StoreDocument>) => {
    return Store.deleteOne(query);
  }