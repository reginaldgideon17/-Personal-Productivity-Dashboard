import { Router } from 'express'
import systemRoutes from './system.route.js'
import notesRoutes from '../routes/notes.route.js'
import authRoutes from '../routes/auth.route.js'
const router = Router()

router.use('/',systemRoutes)
router.use('/notes',notesRoutes)
router.use('/auth',authRoutes)
export default router
