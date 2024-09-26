/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { companyProtect } from "../../middleware/auth.middleware.js";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../../modules/role/role.controller.js";

const router = Router();
router.post("/", await companyProtect(), createRole);
router.get("/", await companyProtect(), getAllRoles);
router.get("/:id", await companyProtect(), getRoleById);
router.patch("/:id", await companyProtect(), updateRole);
router.delete("/:id", await companyProtect(), deleteRole);

export default router;
