import crypto from "crypto";
import { appConfig } from "../../config/appConfig.js";
import { getUserCollection } from "./user.model.js";

export const generateUserId = async (
  companyCode: string,
  companyId: string,
): Promise<string> => {
  const startCount = appConfig.userStartCount;
  const User = await getUserCollection(companyId);
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

export const createStrideId = async (): Promise<any> => {};
