/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  companyProtect,
  userProtect,
} from "../../middleware/auth.middleware.js";
import {
  createUser,
  getAllUsers,
  getUserProfile,
  updateUserByCompany,
  updateUserProfile,
  userLogin,
} from "../../modules/user/user.controller.js";

const router = Router();
router.post("/", await companyProtect(), createUser);
router.post("/login", userLogin);
router.get("/", await companyProtect(), getAllUsers);
router.get("/profile", await userProtect(), getUserProfile);
router.patch("/", await userProtect(), updateUserProfile);
router.patch("/:id", await companyProtect(), updateUserByCompany);

export default router;
