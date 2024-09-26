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
router.post("/", await superAdminProtect(), createCompany);
router.post("/login", companyLogin);
router.get("/", await superAdminProtect(), getAllCompanies);
router.get("/:id", await superAdminProtect(), getCompanyById);
router.patch("/:id", await companyProtect(), updateCompanyProfile);
router.patch("/admin/:id", await superAdminProtect(), updateCompany);
router.delete("/:id", await superAdminProtect(), deleteCompany);

export default router;
