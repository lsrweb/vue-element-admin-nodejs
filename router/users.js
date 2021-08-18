// 用户
const express = require('express')
const router = express.Router()
const users = require('../controller/users')
const userVal = require('../validator/users')


router.post('/backend/register',userVal.isRegister,users.register)
router.post('/backend/login',userVal.isLogin,users.login)
router.get('/backend/getUserinfo',userVal.isToken,users.getUserInfo)
router.get('/backend/getRouter',userVal.isToken,users.getUserRouter)

module.exports = router
