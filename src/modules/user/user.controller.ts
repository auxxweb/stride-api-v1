import { NextFunction, Response } from "express";
// import { FilterQuery } from 'mongoose'

import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import {
  RequestWithCompany,
  RequestWithUser,
} from "../../interface/app.interface.js";
// import { getPaginationOptions } from '../../utils/pagination.utils.js'
// import { ObjectId } from '../../constants/type.js'
import { userService } from "./user.service.js";
import { FilterQuery } from "mongoose";
import { getPaginationOptions } from "../../utils/pagination.utils.js";
import { ObjectId } from "../../constants/type.js";

const createUser = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await userService.createUser({
      ...req.body,
      companyId: req?.company?.companyId,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

const userLogin = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await userService.userLogin({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const getAllUsers = errorWrapper(
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
            firstName: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
          {
            email: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
          {
            employId: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
          {
            additionalDetails: {
              $regex: new RegExp(String(searchTerm)),
              $options: "i",
            },
          },
        ],
      };
    }

    const data = await userService.getAllUsers({
      query: {
        ...query,
        ...(req?.query?.departmentId && {
          departmentId: new ObjectId(String(req.query?.departmentId)),
        }),
        ...(req?.query?.roleId && {
          roleId: new ObjectId(String(req.query?.roleId)),
        }),
        ...(req?.query?.employId && {
          employId: req.query?.employId,
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

const getUserProfile = errorWrapper(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data = await userService.getUserProfile(
      req.user?._id as string,
      req.companyCode as string,
    );

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

const updateUserProfile = errorWrapper(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data = await userService.updateProfile({
      userId: req.user?._id as string,
      companyId: req.companyCode as string,
      userData: {
        ...req.body,
      },
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);
const updateUserByCompany = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await userService.updateUserByCompany({
      userId: req.params?.id,
      companyId: req.company?.companyId,
      userData: {
        ...req.body,
      },
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export {
  createUser,
  userLogin,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateUserByCompany,
};
