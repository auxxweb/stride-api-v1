import { Schema, model } from 'mongoose'

const SuperAdminSchema = new Schema({
  name: {
    type: String,
    default: 'Auxxweb',
  },
  image: {
    type: String,
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
  resetId: {
    type: String,
  },
},{
          timestamps:true
})

const SuperAdmin = model('SuperAdmin', SuperAdminSchema)
export default SuperAdmin
