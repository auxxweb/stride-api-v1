import { hashValue } from '../../utils/auth.utils.js'
import { errorMessages } from '../../constants/messages.js'
import { generateAPIError } from '../../errors/apiError.js'
import { CompanyData } from './company.interface.js'
import Company from './company.model.js'
import { createCompanyId } from './company.utils.js';

const createCompany = async ({
  name,
  email,
  password,
  address,
  location,
  industry,
  theme,
  logo,
  coverImage,
  images,
  phoneNumber,
}: CompanyData | any): Promise<CompanyData | any> => {
  const companyExist = await Company.findOne({
    isDeleted: false,
    $or: [
      {
        email,
      },
      {
        phoneNumber,
      },
    ],
  })

  if (companyExist != null) {
    return await generateAPIError(
      companyExist?.email === email
        ? errorMessages?.companyEmailExists
        : errorMessages?.companyPhoneNumberExists,
      400,
    )
  }

  const hashedPassword = await hashValue(password, 10)
  return await Company.create({
    name,
    email,
    password: hashedPassword,
    address,
    location: {
      coordinates: [location?.lon, location?.lat],
    },
    industry,
    theme,
    logo,
    coverImage,
    phoneNumber,
    images,
    companyId:await createCompanyId()
  })
}

export const companyService = {
  createCompany,
}
