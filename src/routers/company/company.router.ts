/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { protect } from "../../middleware/auth.middleware.js";
import { createCompany } from "../../modules/company/company.controller.js";


const router = Router();
router.post("/", protect(), createCompany);


export default router;
