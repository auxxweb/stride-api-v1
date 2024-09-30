/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { userProtect } from "../../middleware/auth.middleware.js";
import {
  getUserAttendanceByDay,
  markAttendance,
} from "../../modules/attendance/attendance.controller.js";

const router = Router();
router.post("/", await userProtect(), markAttendance);
router.get("/date", await userProtect(), getUserAttendanceByDay);

export default router;
