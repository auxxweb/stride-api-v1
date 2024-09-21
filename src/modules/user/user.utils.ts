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

  return `${companyCode}_E${Number(startCount) + userCount + 1}`;
};

export const generateTempPassword = async (): Promise<string> => {
  const length = 8;
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};
