// 首页数据
const express = require('express')
const router = express.Router()
const dashboard = require('../controller/dashboard')
const validash = require('../validator/dashboard')

const {formTime} = require('../utils')
const folder = formTime(new Date())


let multer = require('multer')


let uploads = multer({
  dest: `./public/uploads/${folder}`
}).single("file");

let uploadsFile = multer({
  dest: `./public/files/${folder}`
}).single('files')


router.get('/backend/index/data', dashboard.getIndexData)

// 首页todo 管理
router.get('/backend/index/todo', dashboard.todo)
router.post('/backend/index/todo/add', validash.isToken, validash.isAdd, dashboard.addtodos)
router.delete('/backend/index/todo/delete', validash.isToken, dashboard.deleteTodo)
router.post('/backend/index/todo/update', validash.isToken, validash.isAdd, dashboard.updatedTodo)
router.get('/backend/index/todo/active', validash.isToken, dashboard.updatedTodoActive)
// 全局上传图片
router.post('/backend/upload/image/global', uploads, dashboard.upload)

// 全局文件上传
router.post('/backend/upload/files/global',uploadsFile,dashboard.uploadFile)


module.exports = router

