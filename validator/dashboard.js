const validator = require('../middleware/validator')
const {body, header, query, check} = require("express-validator");
const {SySqlConnect} = require("../model");
const multer = require('multer')
const jwtUtils = require("../utils/jwt");
const {jwt} = require("../config/default.config");

// 验证是否有token,参数是否传入
exports.isAdd = validator([
  body('text').notEmpty().withMessage('请输入事件名')
])

// 验证Token
exports.isToken = validator([
  header('token').notEmpty().withMessage('登录失败'),
  query('id').bail().custom(async (id) => {
    const sql = `SELECT *
                 FROM to_do
                 WHERE id = ${id}`
    SySqlConnect(sql).then((response) => {
      if (!response) {
        return Promise.reject('该条目不存在,请重新尝试')
      }
    })
  })
])




exports.hasToken = validator([
  header('token').notEmpty().withMessage('登陆失败').bail().custom(async (token, {req}) => {
    await jwtUtils.verify(token, jwt).then((response) => {
      const getNowTime = new Date().getTime()
      const expTime = new Date(response.exp * 1000)
      if (expTime < getNowTime) {
        return Promise.reject('token已失效,请重新登录')
      }
      req.getId = response.userId
      req.roleId = response.roleId

    }).catch((error) => {
      return Promise.reject('签名错误')
    })
  })
])
