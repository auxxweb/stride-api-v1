import { NextFunction, Request, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { companyService } from "./company.service.js";
import { FilterQuery } from "mongoose";
import { getPaginationOptions } from "../../utils/pagination.utils.js";
import { ObjectId } from "../../constants/type.js";
import { RequestWithCompany } from "../../interface/app.interface.js";

const createCompany = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await companyService.createCompany({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

const companyLogin = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await companyService.companyLogin({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const getAllCompanies = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let query: FilterQuery<any> = {
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
          {
            companyId: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
        ],
      };
    }
    const data = await companyService.getAllCompanies({
      query: {
        ...query,
        ...(req?.query?.industry && {
          industry: new ObjectId(String(req.query?.industry)),
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

const getCompanyById = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await companyService.getCompanyById(req.params?.id);

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);
const updateCompany = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await companyService.updateCompany(req.params?.id, {
      ...req?.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateCompanyProfile = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await companyService.updateCompany(String(req.company?._id), {
      ...req?.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const deleteCompany = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await companyService.deleteCompany(req.params?.id);

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export {
  createCompany,
  companyLogin,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateCompanyProfile,
};
