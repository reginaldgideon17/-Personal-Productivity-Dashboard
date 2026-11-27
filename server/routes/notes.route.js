import { Router } from "express"
import { list, create, update, remove } from '../controllers/notes.controller.js'
import { requireAuth } from "../middleware/requireAuth.js"

const router = Router()

router.use(requireAuth)
router.get('/', list)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id',remove)
export default router