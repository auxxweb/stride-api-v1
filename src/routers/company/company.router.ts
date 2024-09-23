/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import {
  companyProtect,
  superAdminProtect,
} from "../../middleware/auth.middleware.js";
import {
  companyLogin,
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyProfile,
} from "../../modules/company/company.controller.js";

const router = Router();
router.post("/", superAdminProtect(), createCompany);
router.post("/login", companyLogin);
router.get("/", superAdminProtect(), getAllCompanies);
router.get("/:id", superAdminProtect(), getCompanyById);
router.patch("/:id", companyProtect(), updateCompanyProfile);
router.patch("/admin/:id", superAdminProtect(), updateCompany);
router.delete("/:id", superAdminProtect(), deleteCompany);

export default router;
