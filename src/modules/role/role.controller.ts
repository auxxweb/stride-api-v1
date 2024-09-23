import { NextFunction, Response } from "express";
import { FilterQuery } from "mongoose";

import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { roleService } from "./role.service.js";
import { RequestWithCompany } from "../../interface/app.interface.js";
import { getPaginationOptions } from "../../utils/pagination.utils.js";
import { ObjectId } from "../../constants/type.js";

const createRole = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await roleService.createRole({
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

const getAllRoles = errorWrapper(
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

    const data = await roleService.getAllRoles({
      query: {
        ...query,
        ...(req?.query?.departmentId && {
          departmentId: new ObjectId(String(req.query?.departmentId)),
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
      status: 201,
    });
  },
);

const getRoleById = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await roleService.getRoleById(
      String(req?.company?.companyId),
      req.params?.id,
    );

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const deleteRole = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await roleService.deleteRole(
      String(req?.company?.companyId),
      req.params?.id,
    );

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateRole = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await roleService.updateRole({
      ...req.body,
      companyId: req?.company?.companyId,
      roleId: req.params?.id,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export { createRole, getAllRoles, getRoleById, deleteRole, updateRole };
