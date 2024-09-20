import { NextFunction, Request, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { superAdminService } from "./superAdmin.service.js";

const createAdmin = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await superAdminService.createAdmin({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

const superAdminLogin = errorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await superAdminService.superAdminLogin({
      ...req.body,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);
export { createAdmin, superAdminLogin };
