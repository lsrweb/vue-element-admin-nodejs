const validator = require('../middleware/validator')
const {body, header, query} = require("express-validator");
const {SySqlConnect} = require("../model");

// 验证是否有token,参数是否传入
exports.isAdd = validator([
  body('text').notEmpty().withMessage('请输入事件名')
])

// 验证Token
exports.isToken = validator([
  header('x_token').notEmpty().withMessage('登录失败'),
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
