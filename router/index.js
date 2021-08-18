const express = require('express')
const router = express.Router()

// 首页数据
router.use(require('./dashboard'))
router.use(require('./users'))




module.exports = router
