/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// import { protect } from "../../middleware/auth.middleware.js";
import {
  createIndustry,
  deleteIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
} from '../../modules/industry/industry.controller.js'

const router = Router()
router.post('/', createIndustry)
router.get('/', getAllIndustries)
router.get('/:id', getIndustryById)
router.patch('/:id', updateIndustry)
router.delete('/:id', deleteIndustry)

export default router
