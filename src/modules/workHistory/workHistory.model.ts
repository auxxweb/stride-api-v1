import { ObjectId } from "../../constants/type.js";
import { model, Schema } from "mongoose";

const WorkHistorySchema = new Schema(
  {
    strideId: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: ObjectId,
      ref: "companies",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
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

const WorkHistory = model("workHistories", WorkHistorySchema);
export default WorkHistory;
