/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { companyProtect } from "../../middleware/auth.middleware.js";
import {
  createUser,
  getAllUsers,
  userLogin,
} from "../../modules/user/user.controller.js";

const router = Router();
router.post("/", companyProtect(), createUser);
router.post("/login", userLogin);
router.get("/", companyProtect(), getAllUsers);

export default router;
