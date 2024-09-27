import { ObjectId } from "../../constants/type.js";
import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      set: (value: string) => value.toLowerCase(), // Ensures email is always stored in lowercase
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Ensures the GeoJSON format is correct
        default: "Point",
        index: "2dsphere", // Adds the necessary geospatial index
      },
      coordinates: {
        type: [Number], // Expecting an array of numbers [longitude, latitude]
        index: "2dsphere", // Ensures proper 2dsphere index for geospatial queries
      },
    },
    industry: {
      type: ObjectId,
      ref: "industries", // Reference to an 'industries' collection
    },
    theme: {
      type: String,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    phoneNumber: {
      type: Number, // Consider using String for better phone number flexibility
    },
    status: {
      type: Boolean,
      default: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs or paths
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  },
);

// Ensure the 2dsphere index for geospatial queries
CompanySchema.index({ location: "2dsphere" });

const Company = model("companies", CompanySchema);

export default Company;
