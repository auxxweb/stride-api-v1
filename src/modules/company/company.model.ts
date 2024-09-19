import { ObjectId } from '../../constants/type.js'
import { Schema, model } from 'mongoose'

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
      set: (value: string) => value.toLowerCase(),
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
        enum: ['Point'],
        default: 'Point',
        index: '2dsphere',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    industry: {
      type: ObjectId,
      ref:"industries"
    },
    theme: {
      type: String,
      // default:""
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    phoneNumber:{
          type:Number
    },
    companyId: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Company = model('companies', CompanySchema)
export default Company
