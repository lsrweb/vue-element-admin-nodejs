// 首页数据
const express = require('express')
const router = express.Router()
const dashboard = require('../controller/dashboard')


router.get('/dashboard/index',dashboard.getIndexData)


module.exports = router
