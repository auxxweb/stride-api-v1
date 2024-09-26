import mongoose from "mongoose";
import { ObjectId } from "../../constants/type.js";
const { model, models, Schema } = mongoose;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyId: {
      type: ObjectId,
      ref: "companies",
    },
    departmentCollection: { type: String, required: true },
    departmentId: {
      type: ObjectId,
      required: true,
      refPath: "departmentCollection",
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

export const getRoleCollection = async (
  companyId: string,
): Promise<mongoose.Model<any>> => {
  const collectionName = `roles${companyId}`;

  // Check if model already exists in mongoose models
  if (models[collectionName]) {
    return models[collectionName]; // Return the existing model
  }

  // If not, create a new model
  return model(collectionName, RoleSchema, collectionName);
};
