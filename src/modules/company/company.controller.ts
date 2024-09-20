import { NextFunction, Request, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { companyService } from "./company.service.js";

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
export { createCompany, companyLogin };
