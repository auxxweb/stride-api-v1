/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { userProtect } from "../../middleware/auth.middleware.js";
import { markAttendance } from "../../modules/attendance/attendance.controller.js";

const router = Router();
router.post("/", await userProtect(), markAttendance);

export default router;
