import { ObjectId } from "../../constants/type.js";
import { Model, Schema, model } from "mongoose";

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
): Promise<Model<any>> => {
  const collectionName = `department_${companyId}`;
  return model(collectionName, DepartmentSchema, collectionName);
};
