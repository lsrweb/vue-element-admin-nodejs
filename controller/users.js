const {SySqlConnect} = require("../model");
const {baseUrl} = require('../config/default.config')
// jwt Token
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
// md5 密码加密
const hamc = require('../utils/hamc')
// 树状结构转化
const {toTree} = require('../utils')

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
exports.login = async (req, res, next) => {
  try {
    const {account, password} = req.body
    const userinfo = req.user
    const userPas = hamc(password)
    const SqlPassword = `SELECT *
                         FROM user_info
                         WHERE account = "${account}"`
    await SySqlConnect(SqlPassword).then((response) => {
      if (response != '') {
        if (response[0].password != userPas) {
          res.status(200).json({
            code: 403,
            message: '密码错误'
          })
        } else {
          jwtUtils.sign({
            userId: userinfo.id
          }, jwt, {expiresIn: '1 days'}).then((token) => {
            res.status(200).json({
              code: 200,
              message: '登录成功',
              token: token
            })
          })

        }
      } else {
        res.status(200).json({
          code: 403,
          message: '暂无该用户'
        })
      }
    })
  } catch (err) {
    next()
  }
}
// 获取用户信息
exports.getUserInfo = async (req, res, next) => {
  try {
    let userId = req.getId
    // 筛选对应pid id 的用户信息
    const sql = `SELECT *
                 FROM userinfo
                 WHERE userinfo.pid = "${userId}"`
    await SySqlConnect(sql).then((response) => {
      if (!response) {
        res.status(200).json({
          code: 500,
          message: '暂无该用户'
        })
      } else {
        let newData = response[0]
        let roleArray = newData.role.split(',')
        newData.avatar = `${baseUrl}/${response[0].avatar}`
        const selectRoleSql = `SELECT *
                               FROM role`
        // 筛选对应角色信息
        SySqlConnect(selectRoleSql).then((response) => {
          let testRole = []
          response.forEach(value => {
            if (roleArray.indexOf(String(value.id)) > -1) {
              testRole.push(value)
            }
          })
          newData.role = testRole
          res.status(200).json({
            code: 200,
            message: '用户信息获取成功',
            data: newData
          })
        })

      }
    })
  } catch (err) {
    next()
  }
}
// 筛选获取权限路由
exports.getUserRouter = async (req, res, next) => {
  let role;
  let resRouter = []
  const getId = req.getId
  // 获取token 所传用户id
  const sqlRole = `SELECT *
                   FROM userinfo
                   WHERE userinfo.pid = "${getId}"`
  await SySqlConnect(sqlRole).then((response) => {
    // 获取多角色处理情况
    let responseRole = response[0].role.split(',')
    role = responseRole
  })
  var routerId = []
  for (let i = 0; i < role.length; i++) {
    let getRouterSql = `SELECT *, role.id
                        FROM role
                        WHERE role.id = "${role[i]}"`
    await SySqlConnect(getRouterSql).then((response) => {
      routerId.push(response[0].role_router.split())
      // routerId.push(test.toString())
    })
  }
  // 拆分路由为一个数组
  let router = routerId.toString().split(',')
  // 获取所有路由
  const sql = `SELECT *
               from permission_router;`
  SySqlConnect(sql).then((response) => {
    let getRouterEnd = response
    // 筛选路由
    getRouterEnd.forEach(value => {
      if (router.includes(String(value.id))) {
        resRouter.push(value)
      }
    });
    let tree = toTree(resRouter)
    res.status(200).json({
      code: 200,
      data: tree,
      message: '权限路由获取成功'
    })
  })
}
