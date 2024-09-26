import mongoose from "mongoose";
import { ObjectId } from "../../constants/type.js";
const { model, models, Schema } = mongoose;

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
  {
    timestamps: true,
  },
);

export const getDepartmentCollection = async (
  companyId: string,
): Promise<mongoose.Model<any>> => {
  const collectionName = `departments${companyId}`;
  if (models[collectionName]) {
    return models[collectionName]; // Return the existing model
  }
  return model(collectionName, DepartmentSchema, collectionName);
};
