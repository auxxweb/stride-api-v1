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
router.post("/", superAdminProtect(), createIndustry);
router.get("/", superAdminProtect(), getAllIndustries);
router.get("/:id", superAdminProtect(), getIndustryById);
router.patch("/:id", superAdminProtect(), updateIndustry);
router.delete("/:id", superAdminProtect(), deleteIndustry);

export default router;
