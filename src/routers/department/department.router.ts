/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../../modules/department/department.controller.js";
import { companyProtect } from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/", await companyProtect(), createDepartment);
router.get("/", await companyProtect(), getAllDepartments);
router.get("/:id", await companyProtect(), getDepartmentById);
router.patch("/:id", await companyProtect(), updateDepartment);
router.delete("/:id", await companyProtect(), deleteDepartment);

export default router;
