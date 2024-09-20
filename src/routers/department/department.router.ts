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
router.post("/", companyProtect(), createDepartment);
router.get("/", companyProtect(), getAllDepartments);
router.get("/:id", companyProtect(), getDepartmentById);
router.patch("/:id", companyProtect(), updateDepartment);
router.delete("/:id", companyProtect(), deleteDepartment);

export default router;
