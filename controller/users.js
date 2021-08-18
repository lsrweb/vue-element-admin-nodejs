const {SySqlConnect} = require("../model");
const {baseUrl} = require('../config/default.config')
// jwt Token
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
// md5 密码加密
const hamc = require('../utils/hamc')

// 用户注册
exports.register = (req, res, next) => {
  try {
    const {username, password, email, account} = req.body
    const md5Password = hamc(password)
    const sql = `INSERT INTO user_info (username, account, email, avatar, password)
                 VALUES ("${username}", "${account}", "${email}", "assets/avatar.jpg", "${md5Password}");`
    SySqlConnect(sql).then((response) => {
      res.status(200).json({
        code: 200,
        message: '用户注册成功'
      })
    })


  } catch (err) {
    next()
  }
}
// 用户登录
exports.login = (req, res, next) => {
  try {
    // const {account, password} = req.body
    // const userPas = hamc(password)
    // const SqlPassword = `SELECT *
    //                      FROM user_info
    //                      WHERE password = "${userPas}" AND account = "${account}"`
    // SySqlConnect(SqlPassword).then((response) => {
    //   if(response[0]) {
    //     if(response[0].password )
    //   } else {
        res.status(404).json({
          code: 200,
          message: '登录成功!'
        })
    //   }
    // })
  } catch (err) {
    next()
  }
}
// 获取用户信息
exports.getUserInfo = async (req, res, next) => {
  try {
    const sql = `SELECT *
                 FROM userinfo
                 WHERE userinfo.id = 1`
    SySqlConnect(sql).then((response) => {
      if (!response) {
        res.status(200).json({
          code: 500,
          message: '暂无该用户'
        })
      } else {
        let newData = response[0]
        newData.avatar = `${baseUrl}/${response[0].avatar}`
        res.status(200).json({
          code: 200,
          message: '用户信息获取成功',
          data: newData
        })
      }
    })
  } catch (err) {
    next()
  }
}
