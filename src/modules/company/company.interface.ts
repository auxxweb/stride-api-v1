import { LocationData } from "../../interface/app.interface.js";


export interface CompanyData {
  name: string
  email: string
  password: string
  address: string
  location: LocationData
  industry?: string
  theme: string
  logo: string
  coverImage: string
  companyId: string
  images: [string]
  phoneNumber:number
}
