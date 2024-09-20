import { Schema, model } from "mongoose";

const IndustrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
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

const Industry = model("industries", IndustrySchema);
export default Industry;
