import { NextFunction, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { FilterQuery } from "mongoose";
import { getPaginationOptions } from "../../utils/pagination.utils.js";
import { RequestWithCompany } from "../../interface/app.interface.js";
import { workHistoryService } from "./workHistory.service.js";
import WorkHistory from "./workHistory.model.js";
import { ObjectId } from "../../constants/type.js";

const getAllWorkHistoryByCompany = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    let query: FilterQuery<typeof WorkHistory> = {
      isDeleted: false,
      companyId: new ObjectId(req.company?._id),
    };

    const paginationOptions = getPaginationOptions({
      limit: req.query?.limit,
      page: req.query?.page,
    });

    const searchTerm = req.query?.searchTerm;

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          {
            strideId: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
        ],
      };
    }

    const data = await workHistoryService.getAllWorkHistories({
      query,
      options: {
        ...paginationOptions,
        sort: { createdAt: -1 },
      },
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const getAllWorkHistories = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    let query: FilterQuery<typeof WorkHistory> = {
      isDeleted: false,
    };

    const paginationOptions = getPaginationOptions({
      limit: req.query?.limit,
      page: req.query?.page,
    });

    const searchTerm = req.query?.searchTerm;

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          {
            strideId: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
        ],
      };
    }

    const data = await workHistoryService.getAllWorkHistories({
      query: {
        ...query,
        ...(req.query?.companyId && {
          companyId: new ObjectId(req.company?._id),
        }),
      },
      options: {
        ...paginationOptions,
        sort: { createdAt: -1 },
      },
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const getWorkHistoryById = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await workHistoryService.getWorkHistoryById(req.params?.id);

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateHistory = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await workHistoryService.updateWorkHistory(req.params?.id, {
      ...req.body,
      companyId: req?.company?._id,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export {
  getAllWorkHistoryByCompany,
  getAllWorkHistories,
  getWorkHistoryById,
  updateHistory,
};
