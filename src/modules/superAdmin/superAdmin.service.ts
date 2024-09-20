import bcrypt from "bcryptjs";

import { generateAPIError } from "../../errors/apiError.js";
import SuperAdmin from "./superAdmin.model.js";
import { errorMessages } from "../../constants/messages.js";
import { generateToken, hashValue } from "../../utils/auth.utils.js";

const createAdmin = async (adminData: any): Promise<any> => {
  const hashedPassword = await hashValue(adminData?.password, 10);
  return await SuperAdmin.create({
    name: adminData?.name,
    email: adminData?.email,
    password: hashedPassword,
  });
};

const superAdminLogin = async ({ email, password }: any): Promise<any> => {
  const admin = await SuperAdmin.findOne({
    email,
    isDeleted: false,
  });

  if (admin === null) {
    return await generateAPIError(errorMessages.inValidEmail, 400);
  }

  const comparePassword = await bcrypt.compare(password, admin?.password ?? "");

  if (!comparePassword) {
    return await generateAPIError(errorMessages.invalidPassword, 400);
  }

  return {
    name: admin?.name,
    email: admin?.email,
    image: admin?.image,
    token: await generateToken({
      id: String(admin?._id),
    }),
  };
};

export const superAdminService = {
  superAdminLogin,
  createAdmin,
};
