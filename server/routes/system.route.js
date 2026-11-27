
import { dbTest, health } from "../controllers/system.controller.js"
import { Router } from "express"


const router = Router()
router.get('/health',health)
router.get('/db-test',dbTest)


export default router