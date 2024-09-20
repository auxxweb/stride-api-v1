import { ObjectId } from "../../constants/type.js";
import { Model, Schema, model } from "mongoose";

export const DepartmentSchema = new Schema(
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
  console.log(companyId, "iddddddddd");

  const collectionName = `department_${companyId}`;
  return model(collectionName, DepartmentSchema, collectionName);
};
