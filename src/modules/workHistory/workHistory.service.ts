import { generateAPIError } from "../../errors/apiError.js";
import { ObjectId } from "../../constants/type.js";
import {
  GetAllWorkHistoriesData,
  UpdateHistoryData,
  WorkHistoryData,
} from "./workHistory.interface.js";
import WorkHistory from "./workHistory.model.js";
import { errorMessages } from "../../constants/messages.js";

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

const updateWorkHistory = async (
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
