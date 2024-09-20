import { NextFunction, Request, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { industryService } from "./industry.service.js";
import { FilterQuery } from "mongoose";
import Industry from "./industry.model.js";
import { getPaginationOptions } from "../../utils/pagination.utils.js";

const createIndustry = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await industryService.createIndustry({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

const getAllIndustries = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let query: FilterQuery<typeof Industry> = {
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
            name: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
        ],
      };
    }

    const data = await industryService.getAllIndustries({
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

const getIndustryById = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await industryService.getIndustryById(req?.params?.id);

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateIndustry = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await industryService.updateIndustry(req?.params?.id, {
      ...req?.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);
const deleteIndustry = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await industryService.deleteIndustry(req?.params?.id);

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
};
