// 首页数据
const express = require('express')
const router = express.Router()
const dashboard = require('../controller/dashboard')
const validash = require('../validator/dashboard')


router.get('/backend/index/data', dashboard.getIndexData)
// 获取todo
router.get('/backend/index/todo', dashboard.todo)
// 添加todo
router.post('/backend/index/todo/add', validash.isToken,validash.isAdd, dashboard.addtodos)
// 删除todo
router.delete('/backend/index/todo/delete',validash.isToken,dashboard.deleteTodo)
// 修改条目
router.post('/backend/index/todo/update',validash.isToken,validash.isAdd,dashboard.updatedTodo)
// 修改条目状态
router.get('/backend/index/todo/active',validash.isToken,dashboard.updatedTodoActive)


module.exports = router
