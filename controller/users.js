const {SySqlConnect} = require("../model");
const {baseUrl} = require('../config/default.config')
// jwt Token
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
// md5 密码加密
const hamc = require('../utils/hamc')
// 树状结构转化
const {toTree, getTime} = require('../utils')
const {response} = require("express");

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
    const userRole = req.userinfo
    console.log(userRole)
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
            userId: userinfo.id,
            roleId: userRole.id
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
    role = response[0].role.split(',')
  })
  let routerId = []
  for (let i = 0; i < role.length; i++) {
    let getRouterSql = `SELECT *, role.id
                        FROM role
                        WHERE role.id = "${role[i]}"`
    await SySqlConnect(getRouterSql).then((response) => {
      routerId.push(response[0].role_router.split(','))
    })
  }
  // 路由数组
  let router = routerId.toString().split(',')
  // 获取所有路由
  const sql = `SELECT role.role_router,
                      permission_router_button.permission,
                      permission_router_button.role,
                      permission_router_button.router_id,
                      permission_router.*
               FROM permission_router,
                    permission_router_button,
                    role
               WHERE role.id = permission_router_button.role
                 AND permission_router_button.router_id = permission_router.id`
  await SySqlConnect(sql).then((response) => {
    // 筛选路由
    response.forEach(value => {
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

// 获取角色列表
exports.getRole = async (req, res, next) => {
  res.status(200).code({
    code: 200,
    message: '角色获取成功'
  })
}
// 修改角色
exports.changeRole = async (req, res, next) => {
  res.status(200).code({
    code: 200,
    message: '角色修改成功'
  })
}
// 删除角色
exports.deleteRole = async (req, res, next) => {
  res.status(200).code({
    code: 200,
    message: '角色删除成功'
  })
}
// 添加角色
exports.addRole = async (req, res, next) => {
  res.status(200).code({
    code: 200,
    message: '角色添加成功'
  })
}


// 获取节点列表
exports.getRouter = async (req, res, next) => {
  const {page, limit = 10} = req.query
  // 获取总数
  let allCount = ""
  const allCountSql = `SELECT *
                       FROM permission_router`
  SySqlConnect(allCountSql).then((response) => {
    if (response) {
      allCount = response.length
    }
  })
  const sql = `SELECT *
               FROM permission_router LIMIT ${page == 1 ? 0 : page * limit / 2},${limit}`
  SySqlConnect(sql).then((response) => {
    res.status(200).json({
      code: 200,
      message: '节点获取成功',
      data: response,
      total: allCount
    })
  })


}
// 修改节点 获取信息:id
exports.getRouterInfo = async (req, res, next) => {

  res.status(200).json({
    code: 200,
    message: '获取信息成功'
  })
}

// 确认修改节点
exports.changeRouterInfo = async (req, res, next) => {

  res.status(200).json({
    code: 200,
    message: '修改成功'
  })
}

// 添加节点
exports.addRouter = async (req, res, next) => {
  let insertId, roleId, userId = ""
  // 解密token,获取userid
  jwtUtils.verify(req.headers.x_token, jwt).then((response) => {
    roleId = response.roleId
  })
  // 解构参数数据
  const {router_name, router_icon, router_component, router_path, router_sort, router_title, router_redirect, router_alwaysShow, router_affix, router_father} = req.data
  // 解构参数按钮权限
  const buttonPermission = req.data.page_button
  // 插入路由数据
  const sqlRouter = `INSERT INTO permission_router (pid, component, path, sort, title, icon, name, redirect, alwaysShow, affix, created_router, updated_router)
                     VALUES ("${router_father}", "${router_component}", "${router_path}", "${router_sort}", "${router_title}", "${router_icon}", "${router_name}",
                             "${router_redirect}", "${router_alwaysShow}", "${router_affix}", "${getTime().created}", "${getTime().updated}")`
  // 插入按钮权限
  await SySqlConnect(sqlRouter).then((response) => {
    insertId = response.insertId
  })
  // const sqlRouterButton = `INSERT INTO permission_router_button (permission, role, router_id, created_button, updated_button)
  //                          VALUES ("${buttonPermission}", "${roleId}", "${insertId}", "${getTime().created}", "${getTime().updated}")`

  // https://www.npmjs.com/package/mysql SQL注入
  let post = [buttonPermission, roleId, insertId, getTime().created, getTime().updated]
  const sqlRouterButton = `INSERT INTO permission_router_button (permission, role, router_id, created_button, updated_button)
                           VALUES (?, ?, ?, ?, ?)`
  await SySqlConnect(sqlRouterButton, post).then((response) => {
    res.status(200).json({
      code: 200,
      message: '节点添加成功'
    })
  })


}

exports.deleteRouter = async (req, res, next) => {
  try {
    const {id} = req.body









    const sql = `DELETE
                 FROM permission_router
                 WHERE id = ? `
    const sqlBtn = `DELETE
                    FROM permission_router_button
                    WHERE router_id = ?`
    const sqlArr = [id]


    await SySqlConnect(sql, sqlArr)
    await SySqlConnect(sqlBtn, sqlArr)
    res.status(200).json({
      code: 200,
      message: '节点删除成功'
    })
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }

}

exports.fatherRouter = async (req, res, next) => {
  const sql = `SELECT *
               FROM permission_router
               WHERE component = 'Layout'`
  SySqlConnect(sql).then((response) => {
    if (response) {
      res.status(200).json({
        code: 200,
        message: '获取父级节点成功',
        data: response
      })
    } else {
      res.status(200).json({
        code: 200,
        message: '获取父级节点成功',
        data: []
      })
    }
  })
}
