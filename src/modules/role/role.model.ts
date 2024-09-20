import { model, Model, Schema } from "mongoose";
import { ObjectId } from "../../constants/type.js";

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
): Promise<Model<any>> => {
  const collectionName = `role_${companyId}`;
  return model(collectionName, RoleSchema, collectionName);
};
