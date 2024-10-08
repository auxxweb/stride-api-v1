/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  companyProtect,
  // protect,
  superAdminProtect,
} from "../../middleware/auth.middleware.js";
import {
  getAllWorkHistories,
  getAllWorkHistoryByCompany,
  getWorkHistoryById,
  updateHistory,
} from "../../modules/workHistory/workHistory.controller.js";

const router = Router();
router.get("/", await superAdminProtect(), getAllWorkHistories);
router.get("/company", await companyProtect(), getAllWorkHistoryByCompany);
router.get("/:id", await superAdminProtect(), getWorkHistoryById);
router.patch("/:id", await companyProtect(), updateHistory);
// router.post("/login", userLogin);
// router.get("/", companyProtect(), getAllUsers);

export default router;
