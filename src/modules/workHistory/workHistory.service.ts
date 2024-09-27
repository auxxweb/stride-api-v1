import { generateAPIError } from "../../errors/apiError.js";
import { ObjectId } from "../../constants/type.js";
import {
  GetAllWorkHistoriesData,
  UpdateHistoryData,
  WorkHistoryData,
} from "./workHistory.interface.js";
import WorkHistory from "./workHistory.model.js";
import { errorMessages } from "../../constants/messages.js";
import { getUserCollection } from "../../modules/user/user.model.js";

const createWorkHistory = async (
  workHistoryData: WorkHistoryData,
): Promise<any> => {
  const { strideId, companyId, startDate, endDate } = workHistoryData;

  const workHistoryExists = await WorkHistory.findOne({
    strideId,
    companyId: new ObjectId(companyId),
    isDeleted: false,
  });

  if (workHistoryExists) {
    return await generateAPIError(errorMessages.workHistoryExists, 400);
  }

  return await (
    await WorkHistory.create({
      strideId,
      companyId,
      startDate,
      endDate,
    })
  ).populate({
    path: "companyId",
    select: "name email address location theme logo phoneNumber isDeleted",
  });
};

const getAllWorkHistories = async ({
  query = {},
  options,
}: GetAllWorkHistoriesData): Promise<any> => {
  console.log(query, "query----");

  const [data, totalCount] = await Promise.all([
    WorkHistory.find(query, {}, options).populate({
      path: "companyId",
      select: "name email address location theme logo phoneNumber isDeleted",
    }),
    WorkHistory.countDocuments(query),
  ]);

  return { data, totalCount };
};

const getWorkHistoryById = async (workHistoryId: string): Promise<any> => {
  const data = await WorkHistory.findOne({
    _id: new ObjectId(workHistoryId),
    isDeleted: false,
  }).populate({
    path: "companyId",
    select: "name email address location theme logo phoneNumber isDeleted",
  });

  if (!data) {
    return await generateAPIError(errorMessages.workHistoryNotfound, 400);
  }

  return data;
};

const updateWorkHistory = async ({
  userId,
  companyId,
  companyCode,
  workHistoryData,
}: {
  userId: string;
  companyCode: string;
  companyId: string;
  workHistoryData: {
    startDate?: Date;
    endDate?: Date;
  };
}): Promise<any> => {
  const { startDate, endDate } = workHistoryData;

  // Validate startDate and endDate
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return await generateAPIError(errorMessages.endDateNotValid, 400);
  }

  // Fetch the user collection based on companyCode
  const User = await getUserCollection(companyCode);

  // Find the user by userId and ensure the user is not deleted
  const user = await User.findOne({
    _id: new ObjectId(userId),
    isDeleted: false,
  });

  if (!user) {
    return await generateAPIError(errorMessages.userNotFound, 400);
  }

  // Find the user's work history by strideId and companyId
  const workHistory = await WorkHistory.findOne({
    strideId: user.strideId,
    companyId: new ObjectId(companyId),
    isDeleted: false,
  });

  if (!workHistory) {
    return await generateAPIError(errorMessages.workHistoryNotfound, 400);
  }

  // Check if the new endDate is valid compared to the existing work history startDate
  if (endDate && new Date(endDate) < new Date(workHistory.startDate)) {
    return await generateAPIError(errorMessages.endDateNotValid, 400);
  }

  // Ensure startDate is after the existing work history endDate if it exists
  if (
    startDate &&
    workHistory.endDate &&
    new Date(startDate) > new Date(workHistory.endDate)
  ) {
    return await generateAPIError(errorMessages.startDateNotValid, 400);
  }

  // Update the work history, setting isWorking to false if endDate is provided
  const updatedWorkHistory = await WorkHistory.findOneAndUpdate(
    {
      strideId: user.strideId,
      companyId: new ObjectId(companyId),
      isDeleted: false,
    },
    {
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    },
    { new: true },
  ).populate({
    path: "companyId",
    select: "name email address location theme logo phoneNumber isDeleted",
  });

  return updatedWorkHistory;
};

const updateWorkHistoryBySuperAdmin = async (
  historyId: string,
  historyData: UpdateHistoryData,
): Promise<any> => {
  const { companyId, startDate, endDate } = historyData;
  const data = await WorkHistory.findOne({
    _id: new ObjectId(historyId),
    companyId: new ObjectId(companyId),
    isDeleted: false,
  }).populate({
    path: "companyId",
    select: "name email address location theme logo phoneNumber isDeleted",
  });

  if (!data) {
    return await generateAPIError(errorMessages.workHistoryNotfound, 400);
  }

  return await WorkHistory.findOneAndUpdate(
    {
      _id: new ObjectId(historyId),
      companyId: new ObjectId(companyId),
      isDeleted: false,
    },
    {
      ...(startDate && {
        startDate,
      }),
      ...(endDate && {
        endDate,
      }),
    },
    {
      new: true,
    },
  ).populate({
    path: "companyId",
    select: "name email address location theme logo phoneNumber isDeleted",
  });
};

export const workHistoryService = {
  createWorkHistory,
  getAllWorkHistories,
  getWorkHistoryById,
  updateWorkHistory,
  updateWorkHistoryBySuperAdmin,
};
