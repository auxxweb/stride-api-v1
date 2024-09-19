import { appConfig } from '../../config/appConfig.js'
import Company from './company.model.js'

export const createCompanyId = async (): Promise<string> => {
  const startCount = appConfig.companyStartCount
  const companyCount:number = await Company.countDocuments()

  console.log(`STRIDECMPNY${Number(startCount) + companyCount+1}`,"strideId");
  

  return `STRIDECMPNY${Number(startCount) + companyCount+1}`
}
