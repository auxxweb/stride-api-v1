/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { superAdminProtect } from "../../middleware/auth.middleware.js";
import {
  companyLogin,
  createCompany,
} from "../../modules/company/company.controller.js";

const router = Router();
router.post("/", superAdminProtect(), createCompany);
router.post("/login", companyLogin);

export default router;
