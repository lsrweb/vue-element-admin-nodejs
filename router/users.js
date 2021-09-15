// 用户
const express = require('express')
const router = express.Router()
const users = require('../controller/users')
const userVal = require('../validator/users')
// 管理员
router.post('/backend/register', userVal.isRegister, users.register)
router.post('/backend/login', userVal.isLogin, users.login)
router.get('/backend/getUserinfo', userVal.isToken, users.getUserInfo)
router.get('/backend/getRouter', userVal.isToken, users.getUserRouter)

router.get('/backend/getAllAdmin',userVal.isToken,users.getAllAdmin)
// router.get('/backend/getAdmin/info',userVal.isToken,users.changeAdminGetInfo)    已废弃,由前台控制
router.post('/backend/getAdmin/add',userVal.isToken,users.addAdmin)
router.delete('/backend/getAdmin/delete',userVal.isToken,users.deleteAdmin)
router.post('/backend/getAdmin/update',userVal.isToken,users.changeAdmin)
router.post('/backend/getAdmin/password',userVal.isToken,users.password)
// 角色管理
router.get('/backend/role', userVal.isToken, users.getRole)
router.post('/backend/role/update', userVal.isToken, users.changeRole)
router.delete('/backend/role/delete', userVal.isToken, users.deleteRole)
router.post('/backend/role/add', userVal.isToken, users.addRole)
router.get('/backend/role/router', userVal.isToken, users.roleRouter)
router.post('/backend/role/reset/router',userVal.isToken,users.resetRouter)
router.get('/backend/role/button',userVal.isToken,users.getRoleButton)
router.post('/backend/role/button/update',userVal.isToken,users.updateRoleButton)
// 节点管理
router.get('/backend/router',userVal.isToken,users.getRouter)
router.get('/backend/router/get',userVal.isToken,users.getRouterInfo)
router.post('/backend/router/update',userVal.isToken,users.changeRouterInfo)
router.post('/backend/router/add',userVal.isToken,userVal.addRouter,users.addRouter)
router.delete('/backend/router/delete',userVal.isToken,users.deleteRouter)
router.get('/backend/router/father',userVal.isToken,users.fatherRouter)



module.exports = router
