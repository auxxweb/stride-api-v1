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
router.post("/", companyProtect(), createRole);
router.get("/", companyProtect(), getAllRoles);
router.get("/:id", companyProtect(), getRoleById);
router.patch("/:id", companyProtect(), updateRole);
router.delete("/:id", companyProtect(), deleteRole);

export default router;
