import { appConfig } from "../../config/appConfig.js";
import Company from "./company.model.js";

export const createCompanyId = async (): Promise<string> => {
  const startCount = appConfig.companyStartCount;
  const companyCount: number = await Company.countDocuments();

  return `STDC${Number(startCount) + companyCount + 1}`;
};
