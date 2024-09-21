import { generateAPIError } from "../../errors/apiError.js";
import { CreateUser } from "./user.interface.js";
import { getUserCollection } from "./user.model.js";
import { errorMessages } from "../../constants/messages.js";
import Company from "../../modules/company/company.model.js";
import { ObjectId } from "../../constants/type.js";
import { generateTempPassword, generateUserId } from "./user.utils.js";
import { hashValue } from "../../utils/auth.utils.js";

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
    _id: new ObjectId(companyId),
    isDeleted: false,
  });

  if (company === null) {
    return await generateAPIError(errorMessages.companyNotFound, 400);
  }

  const userId = await generateUserId(company?.companyId, company?._id);
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
    companyId,
    tempPassword,
    userId,
    password: hashedPassword,
  });
};

export const userService = {
  createUser,
};
