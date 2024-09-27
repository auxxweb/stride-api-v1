/* eslint-disable prefer-const */
import bcrypt from "bcryptjs";
import { generateAPIError } from "../../errors/apiError.js";
import { CreateUser } from "./user.interface.js";
import { getUserCollection } from "./user.model.js";
import { errorMessages } from "../../constants/messages.js";
import Company from "../../modules/company/company.model.js";
import {
  checkStrideExist,
  createStrideId,
  generateTempPassword,
  generateUserId,
  getCompanyIdFromEmployId,
} from "./user.utils.js";
import { generateToken, hashValue } from "../../utils/auth.utils.js";
import { workHistoryService } from "../../modules/workHistory/workHistory.service.js";
import { ObjectId } from "../../constants/type.js";
import { getRoleCollection } from "../../modules/role/role.model.js";
import { getDepartmentCollection } from "../../modules/department/department.model.js";
import WorkHistory from "../../modules/workHistory/workHistory.model.js";

export const createUser = async ({
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

  // Check if the user already exists
  const userExist = await User.findOne({
    isDeleted: false,
    $or: [
      { email },
      { phoneNumber: Number(phoneNumber) }, // Ensure consistent phoneNumber type
    ],
  });

  if (userExist) {
    const conflictField = userExist.email === email ? email : phoneNumber;
    return await generateAPIError(
      `${errorMessages.userExists} with ${conflictField}`,
      400,
    );
  }

  // Check if the company exists
  const company: any = await Company.findOne({
    companyId,
    isDeleted: false,
  });

  if (!company) {
    return await generateAPIError(errorMessages.companyNotFound, 400);
  }

  // Generate necessary IDs and passwords
  const employId = await generateUserId(company.companyId);
  const tempPassword = await generateTempPassword();
  const hashedPassword = await hashValue(tempPassword, 10);

  let strideId;
  const strideExists = await checkStrideExist({
    email,
    phoneNumber: Number(phoneNumber),
  });

  strideId = strideExists || (await createStrideId());

  // Create the user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber: Number(phoneNumber), // Ensure phoneNumber is stored as a number
    ...(adhar && { adhar }), // Check for both null and undefined
    ...(panCard && { panCard }),
    ...(profileImage && { profileImage }),
    departmentCollection: `departments${companyId}`,
    departmentId,
    roleCollection: `roles${companyId}`,
    roleId,
    ...(additionalDetails && { additionalDetails }),
    companyId: company._id, // Ensure you're using the ObjectId version of companyId
    strideId,
    tempPassword,
    employId,
    password: hashedPassword,
  });

  try {
    await workHistoryService.createWorkHistory({
      strideId,
      companyId: company._id,
      startDate: new Date(),
    });
  } catch (error) {
    await User.deleteOne({
      _id: new ObjectId(user?._id),
    });
  }

  return user;
};

const userLogin = async ({ employId, password }: any): Promise<any> => {
  const companyId = await getCompanyIdFromEmployId(employId);
  const User = await getUserCollection(companyId);

  console.log(employId, "employId", companyId, "companyId", password);

  const userData = await User.findOne({
    employId,
    isDeleted: false,
  });

  if (userData === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  if (userData?.status === false) {
    return await generateAPIError(errorMessages.userAccountBlocked, 400);
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
    departmentId: userData?.departmentId,
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
  const User = await getUserCollection(companyId);

  const data = await User.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: `roles${companyId}`,
        localField: "roleId",
        foreignField: "_id",
        as: "roleId",
      },
    },
    {
      $unwind: {
        path: "$roleId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: `departments${companyId}`,
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentId",
      },
    },
    {
      $unwind: {
        path: "$departmentId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        employId: 1,
        phoneNumber: 1,
        adhar: 1,
        panCard: 1,
        profileImage: 1,
        departmentId: 1,
        roleId: 1,
        strideScore: 1,
        status: 1,
        additionalDetails: 1,
        strideId: 1,
        companyId: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
    {
      $sort: options?.sort,
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: options?.skip ?? 0 }, { $limit: options?.limit ?? 10 }],
      },
    },
  ]);
  // const companyId = await getCompanyIdFromEmployId(employId)

  return {
    data: data[0]?.data,
    totalCount: data[0]?.metadata[0]?.total || 0,
  };
};

const getUserProfile = async (
  userId: string,
  companyId: string,
): Promise<any> => {
  const User = await getUserCollection(companyId);

  console.log(companyId, "company-----");

  const data = await User.aggregate([
    {
      $match: {
        isDeleted: false,
        _id: new ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: `roles${companyId}`,
        localField: "roleId",
        foreignField: "_id",
        as: "roleId",
      },
    },
    {
      $unwind: {
        path: "$roleId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: `departments${companyId}`,
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentId",
      },
    },
    {
      $unwind: {
        path: "$departmentId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        employId: 1,
        phoneNumber: 1,
        adhar: 1,
        panCard: 1,
        profileImage: 1,
        departmentId: 1,
        roleId: 1,
        strideScore: 1,

        status: 1,
        additionalDetails: 1,
        strideId: 1,
        companyId: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
  ]);

  if (!data) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  return data[0];
};

const updateProfile = async ({
  userId,
  companyId,
  userData,
}: any): Promise<any> => {
  const {
    firstName,
    lastName,
    phoneNumber,
    adhar,
    panCard,
    profileImage,
    password,
    oldPassword,
  } = userData;
  const User = await getUserCollection(companyId);

  const user = await User.findOne({
    _id: new ObjectId(userId),
    isDeleted: false,
  });

  if (user === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  const roleModel = await getRoleCollection(companyId);
  const departmentModel = await getDepartmentCollection(companyId);
  let hashedPassword;
  if (password && oldPassword) {
    const comparePassword = await bcrypt.compare(
      oldPassword,
      user?.password ?? "",
    );
    if (!comparePassword) {
      return await generateAPIError(errorMessages.invalidOldPassword, 400);
    }
  }

  if (password && oldPassword) {
    hashedPassword = await hashValue(password ?? "", 10);
    console.log(hashedPassword, "hashword");
  }

  return await User.findOneAndUpdate(
    {
      _id: new ObjectId(userId),
      isDeleted: false,
    },
    {
      ...(firstName && {
        firstName,
      }),
      ...(lastName && {
        lastName,
      }),
      ...(phoneNumber && {
        phoneNumber,
      }),
      ...(adhar && {
        adhar,
      }),
      ...(panCard && {
        panCard,
      }),
      ...(profileImage && {
        profileImage,
      }),
      ...(password &&
        oldPassword && {
          password: hashedPassword,
        }),
    },
    {
      new: true,
    },
  )
    .populate({
      path: "roleId",
      model: roleModel.modelName, // Use the modelName to explicitly provide the model
    })
    .populate({
      path: "departmentId",
      model: departmentModel.modelName, // Use the modelName to explicitly provide the model
    })
    .select(
      "-password -tempPassword -resetId -roleCollection -departmentCollection",
    );
};
const updateUserByCompany = async ({
  userId,
  companyId,
  userData,
}: any): Promise<any> => {
  const {
    firstName,
    lastName,
    phoneNumber,
    adhar,
    panCard,
    profileImage,
    status,
    departmentId,
    roleId,
    password,
    email,
  } = userData;
  const User = await getUserCollection(companyId);

  const user = await User.findOne({
    _id: new ObjectId(userId),
    isDeleted: false,
  });

  if (user === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  const roleModel = await getRoleCollection(companyId);
  const departmentModel = await getDepartmentCollection(companyId);

  let hashedPassword;
  if (password) {
    hashedPassword = await hashValue(password ?? "", 10);
    console.log(hashedPassword, "hashword");
  }

  return await User.findOneAndUpdate(
    {
      _id: new ObjectId(userId),
      isDeleted: false,
    },
    {
      ...(firstName && {
        firstName,
      }),
      ...(lastName && {
        lastName,
      }),
      ...(phoneNumber && {
        phoneNumber,
      }),
      ...(adhar && {
        adhar,
      }),
      ...(panCard && {
        panCard,
      }),
      ...(profileImage && {
        profileImage,
      }),
      ...(password &&
        hashedPassword && {
          password: hashedPassword,
        }),
      ...(status !== null && {
        status,
      }),
      ...(departmentId && {
        departmentId,
      }),
      ...(roleId && {
        roleId,
      }),
      ...(email && {
        email,
      }),
    },
    {
      new: true,
    },
  )
    .populate({
      path: "roleId",
      model: roleModel.modelName, // Use the modelName to explicitly provide the model
    })
    .populate({
      path: "departmentId",
      model: departmentModel.modelName, // Use the modelName to explicitly provide the model
    })
    .select(
      "-password -tempPassword -resetId -roleCollection -departmentCollection",
    );
};

const updateUserByAdmin = async ({
  userId,
  companyId,
  userData,
}: any): Promise<any> => {
  const { status } = userData;
  const User = await getUserCollection(companyId);

  const user = await User.findOne({
    employId: userId,
    isDeleted: false,
  });

  if (user === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  const roleModel = await getRoleCollection(companyId);
  const departmentModel = await getDepartmentCollection(companyId);

  console.log(user, "statys");

  return await User.findOneAndUpdate(
    {
      employId: userId,
    },
    {
      ...(status !== null && {
        status,
      }),
    },
    {
      new: true,
    },
  )
    .populate({
      path: "roleId",
      model: roleModel.modelName, // Use the modelName to explicitly provide the model
    })
    .populate({
      path: "departmentId",
      model: departmentModel.modelName, // Use the modelName to explicitly provide the model
    })
    .select(
      "-password -tempPassword -resetId -roleCollection -departmentCollection",
    );
};

const getUserByStrideId = async (strideId: string): Promise<any> => {
  const userExist = await WorkHistory.findOne({
    strideId,
    isDeleted: false,
  });

  if (userExist === null) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }
  // const data = WorkHistory.aggregate([
  //   {
  //     $match: {
  //       strideId,
  //       isDeleted: false,
  //     },
  //   },
  // ])
};

const findUserStrideScore = async ({
  userId,
  companyId,
}: {
  userId: string;
  companyId: string;
}): Promise<any> => {
  const User = await getUserCollection(companyId);

  const data = await User.findOne({
    _id: new ObjectId(userId),
    isDeleted: false,
  }).select("strideScore _id");

  if (!data) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }
};

export const userService = {
  createUser,
  userLogin,
  getAllUsers,
  getUserProfile,
  updateProfile,
  updateUserByCompany,
  updateUserByAdmin,
  getUserByStrideId,
  findUserStrideScore,
};
