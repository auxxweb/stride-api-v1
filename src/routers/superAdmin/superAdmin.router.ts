/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  createAdmin,
  superAdminLogin,
} from "../../modules/superAdmin/superAdmin.controller.js";

// import { protect } from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/", createAdmin);
router.post("/login", superAdminLogin);

export default router;
