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
      ...(req.body?.login && {
        login: {
          location: req.body?.login?.location,
          time: req.body?.login?.location?.time
            ? new Date(req.body?.login?.location?.time as string)
            : new Date(),
        },
      }),
      ...(req.body?.logOut && {
        logOut: {
          location: req.body?.logOut?.location,
          time: req.body?.logOut?.location?.time
            ? new Date(req.body?.logOut?.location?.time as string)
            : new Date(),
        },
      }),
      date: req.body?.date ? new Date(req.body.date as string) : new Date(),
      userId: req.user?._id as string,
      companyId: req.companyCode as string,
    });

    return responseUtils.success(res, {
      data,
      status: 201,
    });
  },
);
const getUserAttendanceByDay = errorWrapper(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(req.query?.date, "date-date");

    const data = await attendanceService.getUserAttendance({
      date: req.query?.date ? new Date(req.query.date as string) : new Date(),
      userId: req.user?._id as string,
      companyId: req.companyCode as string,
    });

    return responseUtils.success(res, {
      data,
      status: 200,
    });
  },
);

export { markAttendance, getUserAttendanceByDay };
