/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { superAdminProtect } from "../../middleware/auth.middleware.js";
import {
  createIndustry,
  deleteIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
} from "../../modules/industry/industry.controller.js";

const router = Router();
router.post("/", await superAdminProtect(), createIndustry);
router.get("/", await superAdminProtect(), getAllIndustries);
router.get("/:id", await superAdminProtect(), getIndustryById);
router.patch("/:id", await superAdminProtect(), updateIndustry);
router.delete("/:id", await superAdminProtect(), deleteIndustry);

export default router;
