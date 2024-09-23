import { NextFunction, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { departmentService } from "./department.service.js";
import { RequestWithCompany } from "../../interface/app.interface.js";
import { getPaginationOptions } from "../../utils/pagination.utils.js";
import { FilterQuery } from "mongoose";
import { ObjectId } from "../../constants/type.js";

const createDepartment = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await departmentService.createDepartment({
      ...req.body,
      companyId: req?.company?.companyId,
      companyObjectId: req?.company?._id,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

const getAllDepartments = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
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
        ],
      };
    }

    const data = await departmentService.getAllDepartments({
      query: {
        ...query,
        ...(req?.query?.companyId && {
          companyId: new ObjectId(String(req.query?.companyId)),
        }),
      },
      options: {
        ...paginationOptions,
        sort: { createdAt: -1 },
      },
      companyId: String(req?.company?.companyId),
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const getDepartmentById = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await departmentService.getDepartmentById(
      String(req?.company?.companyId),
      req?.params?.id,
    );

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateDepartment = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await departmentService.updateDepartment({
      ...req.body,
      companyId: req?.company?.companyId,
      departmentId: req?.params?.id,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const deleteDepartment = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await departmentService.deleteDepartment(
      String(req?.company?.companyId),
      req?.params?.id,
    );

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
