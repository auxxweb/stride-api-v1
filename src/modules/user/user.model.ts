/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose from "mongoose";
import { ObjectId } from "../../constants/type.js";
import { UserGenderEnum } from "./user.enums.js";
const { model, Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      set: (value: string) => value.toLowerCase(),
    },
    gender: {
      type: String,
      enum: UserGenderEnum,
      required: true,
    },
    address: {
      type: String,
    },
    emergencyNumber: {
      type: Number,
    },
    employId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    countryCode: {
      type: String,
    },
    tempPassword: {
      type: String,
    },
    password: {
      type: String,
      minlength: 4,
    },
    adhar: {
      type: {
        number: Number,
        images: [String],
      },
    },
    panCard: {
      type: {
        number: String,
        images: [String],
      },
    },
    profileImage: {
      type: String,
    },
    departmentCollection: { type: String, required: true },
    departmentId: {
      type: ObjectId,
      required: true,
      refPath: "departmentCollection",
    },
    roleCollection: {
      type: String,
      required: true,
    },
    roleId: {
      type: ObjectId,
      refPath: "roleCollection",
      required: true,
    },
    strideScore: {
      type: Number,
      default: 50,
    },
    status: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: String,
    },
    strideId: {
      type: String,
      required: true,
      unique: true,
    },
    resetId: {
      type: String,
    },
    companyId: {
      type: ObjectId,
      ref: "companies",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const getUserCollection = async (
  companyId: string,
): Promise<mongoose.Model<any>> => {
  const collectionName = `users${companyId}`;
  // if (models[collectionName]) {
  //   return models[collectionName]; // Return the existing model
  // }
  return model(collectionName, UserSchema, collectionName);
};
