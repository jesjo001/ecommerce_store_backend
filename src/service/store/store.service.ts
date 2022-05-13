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
  return Store.findOne(query, {}, options);
}

export const findAllStore = async() => {
    return Store.find({});
}
export const countStore = (
  query: FilterQuery<StoreDocument>,
) => {
  return Store.find(query).countDocuments({});
};

export const findStores = (
  query: FilterQuery<StoreDocument>,
  options: QueryOptions
) => {
  return Store.findOneAndUpdate(query, {}, options);
};

export const findAndUpdate = (
    query: FilterQuery<StoreDocument>,
    update: UpdateQuery<StoreDocument>,
    options: QueryOptions
  ) => {
    return Store.findOneAndUpdate(query, update, options);
  };
  
  export const deleteStore = async (query: FilterQuery<StoreDocument>) => {
    return Store.deleteOne(query);
  }