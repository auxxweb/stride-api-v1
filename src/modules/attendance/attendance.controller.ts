import { NextFunction, Response } from "express";
import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { attendanceService } from "./attendance.service.js";
import { RequestWithUser } from "../../interface/app.interface.js";
// import { FilterQuery } from "mongoose";
// import { getPaginationOptions } from "../../utils/pagination.utils.js";
// import { ObjectId } from "../../constants/type.js";

const markAttendance = errorWrapper(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data = await attendanceService.markAttendance({
      ...req.body,
      userId: req.user?._id as string,
      companyId: req.companyCode as string,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);

export { markAttendance };
