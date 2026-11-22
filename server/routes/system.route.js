const router = require('express').Router()
const system = require('../controllers/system.controller')


//Routes 
router.get('/health',system.health)
router.get('/db-test',system.dbTest)

module.exports = router