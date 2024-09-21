import { NextFunction, Response } from "express";
// import { FilterQuery } from 'mongoose'

import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { RequestWithCompany } from "../../interface/app.interface.js";
// import { getPaginationOptions } from '../../utils/pagination.utils.js'
// import { ObjectId } from '../../constants/type.js'
import { userService } from "./user.service.js";

const createUser = errorWrapper(
  async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    const data = await userService.createUser({
      ...req.body,
      companyId: req?.company?._id,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

export { createUser };
