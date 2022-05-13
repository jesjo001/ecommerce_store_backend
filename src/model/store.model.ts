import mongoose from "mongoose";
import { USER_TYPE } from "../utils/Constants";

export interface StoreDocument extends mongoose.Document {
    storeName: string;
    userId: string;
    isRegistered: boolean;
    registeredNumber: string;
    registeredName: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    country: string;
    countryCode: string;
    createdAt: Date;
    updatedAt: Date;
    approved: Boolean;
    deleted: Boolean;
}


const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    isRegistered: {
        type: Boolean,
        required: true,
    },
    registeredNumber: {
        type: String,
        required: false,
        trim: true,
    },
    registeredName: {
        type: String,
        required: false,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        minlength: 5
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    approved: { type: Boolean, require: false, default:false },
    deleted: { type: Boolean, require: false, default:false },
}, {
    timestamps: true,
})


const Store = mongoose.model<StoreDocument>("Store", storeSchema);
export default Store;
