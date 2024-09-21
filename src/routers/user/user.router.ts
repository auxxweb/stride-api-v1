/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { companyProtect } from "../../middleware/auth.middleware.js";
import { createUser } from "../../modules/user/user.controller.js";

const router = Router();
router.post("/", companyProtect(), createUser);

export default router;
