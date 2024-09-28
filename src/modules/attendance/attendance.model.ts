import mongoose from "mongoose";
import { ObjectId } from "../../constants/type.js";
const { model, models, Schema } = mongoose;

const AttendanceSchema = new Schema(
  {
    userCollection: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      refPath: "userCollection",
    },
    date: {
      type: Date,
      required: true,
    },
    login: {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true, // Ensure coordinates are always required
          index: "2dsphere",
        },
      },
      time: {
        type: Date,
        required: true, // Ensure login time is always required
      },
    },
    logOut: {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: false, // Coordinates may not always be present, so set to false
          index: "2dsphere",
        },
      },
      time: Date,
    },
    breakData: [
      {
        breakIn: Date,
        breakOut: Date,
      },
    ],
    additionalDetails: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const getAttendanceCollection = async (
  companyId: string,
): Promise<mongoose.Model<any>> => {
  const collectionName = `attendance${companyId}`;

  if (models[collectionName]) {
    return models[collectionName];
  }

  return model(collectionName, AttendanceSchema, collectionName);
};
