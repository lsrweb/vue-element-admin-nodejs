const validator = require('../middleware/validator')
const {body, header} = require("express-validator");
const {SySqlConnect} = require("../model");
const {validatePassword} = require('../config/default.config')
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
const {response} = require("express");

// 注册参数验证
exports.isRegister = validator([
  body('username').notEmpty().withMessage('用户名不可为空'),
  body('account').notEmpty().withMessage('注册账号不可为空').bail().custom(async (account) => {
    const sql = `SELECT *
                 FROM user_info
                 WHERE account = "${account}"`
    await SySqlConnect(sql).then((response) => {
      if (response[0]) {
        return Promise.reject('账号已经存在,请重新注册!')
      }
    })
  }),
  body('password').notEmpty().withMessage('密码不可为空').bail().custom(async (password) => {
    // 密码须以小写字母开头,长度6-18字符,除下划线外不可含有其他字符
    const reg = /^[a-zA-Z]\w{5,17}$/
    if (password.length < 6) {
      return Promise.reject('密码太短啦,请重新输入!')
    }
    if (!reg.test(password)) {
      return Promise.reject('密码格式错误')
    }
  }),
  body('email').notEmpty().withMessage('邮箱不可为空').isEmail()
])

// 登陆参数验证
exports.isLogin = validator([
  body('account').notEmpty().withMessage('请输入登录账号'),
  body('password').notEmpty().withMessage('请输入登录密码').bail().custom(async (password, {req}) => {
    // 密码须以小写字母开头,长度6-18字符,除下划线外不可含有其他字符
    const reg = /^[a-zA-Z]\w{5,17}$/
    if (!reg.test(password)) {
      return Promise.reject('密码格式错误')
    }
    const sql = `SELECT *
                 FROM user_info
                 WHERE account = "${req.body.account}"`
    await SySqlConnect(sql).then((response) => {
      if (!response[0]) {
        return Promise.reject('账号不存在,请仔细检查后再次输入')
      }
      req.user = response[0]
    })
  }),
])
// token 有效验证
exports.isToken = validator([
  header('X_Token').notEmpty().withMessage('登陆失败').bail().custom(async (token,{req}) => {
    await jwtUtils.verify(token, jwt).then((response) => {
      const getNowTime = new Date().getTime()
      const expTime = new Date(response.exp * 1000)
      if (expTime < getNowTime) {
        return Promise.reject('token已失效,请重新登录')
      }
      req.getId = response.userId

    }).catch((error) => {
      return Promise.reject('签名错误')
    })
  })
])
