import crypto from "crypto";
import { appConfig } from "../../config/appConfig.js";
import { getUserCollection } from "./user.model.js";
import WorkHistory from "../../modules/workHistory/workHistory.model.js";
import { StrideExistData } from "./user.interface.js";
import Company from "../../modules/company/company.model.js";

export const generateUserId = async (companyCode: string): Promise<string> => {
  const startCount = appConfig.userStartCount;
  const User = await getUserCollection(companyCode);
  const userCount = await User.countDocuments({
    isDeleted: false,
  });

  return `${companyCode}E${Number(startCount) + userCount + 1}`;
};

export const generateTempPassword = async (): Promise<string> => {
  const length = 8;
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

export const getCompanyIdFromEmployId = async (
  employId: string,
): Promise<any> => {
  const companyId = employId?.split("E")[0];

  console.log(companyId); // Output: STDC10001
  return companyId;
};

export const createStrideId = async (): Promise<any> => {
  const startCount = appConfig.userStartCount;
  const WorkHistoryCount = await WorkHistory.countDocuments();

  return `STDUAA${Number(startCount) + WorkHistoryCount + 1}`;
};

export const checkStrideExist = async ({
  email,
  phoneNumber,
}: StrideExistData): Promise<any> => {
  const companyIds = await Company.find({}, { companyId: 1 });

  if (companyIds?.length > 0) {
    console.log(companyIds, "length is required");

    // Use Promise.all to resolve the array of promises from map
    const strideIds = await Promise.all(
      companyIds.map(async (company) => {
        const User = await getUserCollection(company?.companyId);

        const user = await User.findOne(
          {
            $or: [{ email }, { phoneNumber }],
          },
          {
            strideId: 1,
          },
        );

        return user ? user.strideId : false;
      }),
    );

    // Return the first non-false strideId found, or false if none exists
    const validStrideId = strideIds.find((id) => id !== false);
    return validStrideId || false;
  } else {
    return false;
  }
};
