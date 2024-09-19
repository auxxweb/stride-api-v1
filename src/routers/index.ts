/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
// import userRouter from "./user/user.router.js";
import { healthCheck } from '../controller/app.controller.js'
import { getS3Urls } from '../controller/s3.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import companyRouter from './company/company.router.js'
import industryRouter from './industry/industry.router.js'

const router = Router()
router.post('/s3url', protect(), getS3Urls)

router.get('/', healthCheck)
router.use('/company', companyRouter)
router.use('/industry', industryRouter)
// router.use("/user", userRouter);

export default router
