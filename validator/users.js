const validator = require('../middleware/validator')
const {body, header} = require("express-validator");
const {SySqlConnect} = require("../model");
const {validatePassword} = require('../config/default.config')
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
const {response} = require("express");
const {objectValidate, deleteObjKey} = require("../utils/index")


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
        // const reg = /^[a-zA-Z]\w{5,17}$/
        // if (!reg.test(password)) {
        //     return Promise.reject('密码格式错误')
        // }
        const sql = `SELECT *
                     FROM user_info
                     WHERE account = "${req.body.account}"`
        let pid = ""
        await SySqlConnect(sql).then((response) => {
            // console.log(response)
            if (!response[0]) {
                return Promise.reject('账号不存在,请仔细检查后再次输入')
            }
            req.user = response[0]
            pid = response[0].id
        })
        const sqlRole = `SELECT *
                         FROM userinfo,
                              role
                         WHERE userinfo.pid = ${pid}`
        await SySqlConnect(sqlRole).then((result) => {
            req.userinfo = result[0]
        })
    }),
])
// token 有效验证
exports.isToken = validator([
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

exports.addRouter = (req, res, next) => {
    const string = JSON.stringify(req.body.data)
    const object = JSON.parse(string)
    const newObject = deleteObjKey(object, [''])
    const docBook = {
        router_name: '节点名称',
        router_icon: '节点图标',
        router_component: '节点组件位置',
        router_path: '节点访问',
        router_sort: '节点排序',
        router_title: '节点标题',
        router_redirect: '节点默认重定向',
        router_alwaysShow: '节点默认显示规则',
        router_affix: '是否固定标签栏',
        page_button: '权限按钮'
    }
    let result = objectValidate(docBook, newObject)
    if (result) {
        res.status(200).json({
            code: 402,
            message: `${result}不能为空`
        })
        return false
    }
    req.data = newObject
    next()
}

