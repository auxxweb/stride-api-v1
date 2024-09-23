import bcrypt from "bcryptjs";
import { generateAPIError } from "../../errors/apiError.js";
import { CreateUser } from "./user.interface.js";
import { getUserCollection } from "./user.model.js";
import { errorMessages } from "../../constants/messages.js";
import Company from "../../modules/company/company.model.js";
import {
  generateTempPassword,
  generateUserId,
  getCompanyIdFromEmployId,
} from "./user.utils.js";
import { generateToken, hashValue } from "../../utils/auth.utils.js";

const createUser = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  adhar,
  panCard,
  profileImage,
  departmentId,
  roleId,
  additionalDetails,
  companyId,
}: CreateUser): Promise<any> => {
  const User = await getUserCollection(companyId);

  const userExist = await User.findOne({
    isDeleted: false,
    $or: [
      {
        email,
      },
      {
        phoneNumber,
      },
    ],
  });

  if (userExist !== null) {
    return await generateAPIError(
      `${errorMessages.userExists} with ${
        userExist?.email === email ? email : phoneNumber
      }`,
      400,
    );
  }

  const company: any = await Company.findOne({
    companyId,
    isDeleted: false,
  });

  if (company === null) {
    return await generateAPIError(errorMessages.companyNotFound, 400);
  }

  const employId = await generateUserId(company?.companyId, company?._id);
  const tempPassword = await generateTempPassword();
  const hashedPassword = await hashValue(tempPassword, 10);

  return await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    ...(adhar !== null && {
      adhar,
    }),
    ...(panCard !== null && {
      panCard,
    }),
    ...(profileImage !== null && {
      profileImage,
    }),
    departmentCollection: `department_${companyId}`,
    departmentId,
    roleCollection: `role_${companyId}`,
    roleId,
    ...(additionalDetails !== null && {
      additionalDetails,
    }),
    companyId: company?._id,
    tempPassword,
    employId,
    password: hashedPassword,
  });
};

const userLogin = async ({ employId, password }: any): Promise<any> => {
  const companyId = await getCompanyIdFromEmployId(employId);
  const User = await getUserCollection(companyId);

  console.log(employId, "employId", companyId, "companyId", password);

  const userData = await User.findOne({
    employId,
    isDeleted: false,
  }).populate("roleId");

  if (userData === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  const comparePassword = await bcrypt.compare(
    password,
    userData?.password ?? "",
  );

  if (!comparePassword) {
    return await generateAPIError(errorMessages.invalidPassword, 400);
  }

  return {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    userId: userData?.userId,
    phoneNumber: userData?.phoneNumber,
    adhar: userData?.adhar,
    panCard: userData?.panCard,
    departmentId: userData?.department,
    roleId: userData?.roleId,
    strideScore: userData?.strideScore,
    status: userData?.status,
    additionalDetails: userData?.additionalDetails,
    companyId: userData?.companyId,
    isDeleted: userData?.isDeleted,
    createdAt: userData?.createdAt,
    updatedAt: userData?.updatedAt,
    token: await generateToken({
      id: String(userData?._id),
      companyId,
    }),
  };
};

const getAllUsers = async ({
  query = {},
  options,
  companyId,
}: any): Promise<any> => {
  // const companyId = await getCompanyIdFromEmployId(employId)
  const User = await getUserCollection(companyId);
  const [data, totalCount] = await Promise.all([
    await User.find(query, {}, options)
      // .populate('industry')
      .select("-password"),
    await User.countDocuments(query),
  ]);

  return { data, totalCount };
};

export const userService = {
  createUser,
  userLogin,
  getAllUsers,
};
