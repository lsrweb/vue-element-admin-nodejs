const {SySqlConnect} = require("../model");
const {baseUrl} = require('../config/default.config')
// jwt Token
const jwtUtils = require('../utils/jwt')
const {jwt} = require('../config/default.config')
// md5 密码加密
const hamc = require('../utils/hamc')
// 树状结构转化
const {toTree, getTime, changeUpdatedTime} = require('../utils')
const {response} = require("express");
const {NULL} = require("mysql/lib/protocol/constants/types");

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
  const sql = `SELECT *
               FROM role`
  await SySqlConnect(sql).then((response) => {
    res.status(200).json({
      code: 200,
      message: '角色获取成功',
      data: response
    })
  })
}
// 修改角色
exports.changeRole = async (req, res, next) => {
  const {id, role, role_name, sort} = req.body
  const sql = `UPDATE \`nodejs\`.\`role\`
               SET \`role\`      = ?,
                   \`sort\`      = ?,
                   \`role_name\` = ?,
                   \`update\`    = ?
               WHERE \`id\` = ?`
  await SySqlConnect(sql, [role, sort, role_name, changeUpdatedTime(), id]).then((response) => {
    if (response) {
      res.status(200).json({
        code: 200,
        message: '角色修改成功'
      })
    } else {
      res.status(500)
    }
  })


}
// 删除角色
exports.deleteRole = async (req, res, next) => {
  const {id} = req.query
  const sql = `DELETE
               FROM role
               WHERE id = ?`
  await SySqlConnect(sql, [id]).then(() => {
    res.status(200).json({
      code: 200,
      message: '角色删除成功'
    })
  })
}
// 添加角色
exports.addRole = async (req, res, next) => {
  const {name, role, sort} = req.body
  const sql = `INSERT INTO \`nodejs\`.\`role\` (\`role_name\`, \`role\`, \`sort\`, \`created\`, \`update\`)
               VALUES (?, ?, ?, ?, ?)`
  await SySqlConnect(sql, [name, role, sort, getTime().created, getTime().updated]).then((response) => {
    if (response) {
      res.status(200).json({
        code: 200,
        message: '角色添加成功'
      })
    } else {
      res.status(500)
    }
  })
}
/**
 * 获取对应权限路由
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.roleRouter = async (req, res, next) => {
  const {id} = req.query
  const roleSql = `SELECT role_router
                   FROM role
                   WHERE role.id = ?`
  const roleRouterSql = `SELECT *
                         FROM permission_router`
  const resultRouter = await SySqlConnect(roleSql, [id]).then((res) => {
    return res[0].role_router.split(',')
  })
  const resRouter = await SySqlConnect(roleRouterSql).then((res) => {
    return res
  })
  let endRouter = []
  resRouter.forEach(val => {
    if (resultRouter.indexOf(String(val.id)) > -1) {
      endRouter.push(val)
      val.check = true
    } else {
      endRouter.push(val)
      val.check = false
    }
  })
  res.status(200).json({
    code: 200,
    message: '角色权限获取成功',
    data: endRouter
  })
}

exports.updateRoleButton = async (req, res, next) => {
  const {button, id} = req.body
  const sql = `UPDATE \`nodejs\`.\`permission_router_button\`
               SET \`permission\` = ?
               WHERE \`role\` = ?
                 AND \`router_id\` = ?`
  await SySqlConnect(sql, [button, req.roleId, id]).then((response) => {
    res.status(200).json({
      code: 200,
      message: '修改成功'
    })
  })

}
// 重置按钮权限
exports.resetRouter = async (req, res, next) => {
  const {data, id} = req.body
  const resetSql = `UPDATE \`nodejs\`.\`role\`
                    SET \`role_router\` = ?
                    WHERE \`id\` = ?`
  await SySqlConnect(resetSql, [data.join(','), id]).then((response) => {
    if (response) {
      res.status(200).json({
        code: 200,
        message: '修改成功'
      })
    }
  })
}

// exports.getAllRouter = async (req,res,next) =>{
//   const sql = `SELECT * FROM permission_router`
//   await SySqlConnect(sql).then((response) => {
//     res.status(200).json({
//       code: 200,
//       message: '数据获取成功',
//       data: response
//     })
//   })
// }

// 获取对应角色的按钮权限
exports.getRoleButton = async (req, res, next) => {
  const {role, router} = req.query
  const sql = `SELECT *
               FROM permission_router_button
               WHERE permission_router_button.role = ?
                 AND permission_router_button.router_id = ?`
  await SySqlConnect(sql, [role, router]).then((response) => {
    if (response[0]) {
      const result = response[0].permission.split(',')
      res.status(200).json({
        code: 200,
        message: '按钮权限获取成功',
        data: result
      })
    } else {
      res.status(200).json({
        code: 503,
        message: '暂无查询结果'
      })
    }
  })
}
// 获取节点列表
exports.getRouter = async (req, res, next) => {
  const {page = 1, limit = 10} = req.query
  // 获取总数
  let allCount = ""
  const allCountSql = `SELECT *
                       FROM permission_router`
  await SySqlConnect(allCountSql).then((response) => {
    if (response) {
      allCount = response.length
    }
  })
  const sql = `SELECT *
               FROM permission_router LIMIT ${page == 1 ? 0 : page * limit / 2},${limit}`
  await SySqlConnect(sql).then((response) => {
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
  const {id} = req.query
  const sql = `SELECT *
               FROM permission_router
               WHERE id = ?`
  // 查询按钮表,角色表  -> 按钮表路由id== ? AND 按钮表 role == ? AND 角色表id == id
  const sqlButton = `SELECT *
                     FROM permission_router_button
                     WHERE router_id = ?
                       AND role > ?`
  let resultButton = null
  await SySqlConnect(sqlButton, [id, 0]).then((res) => {
    if (res != "") {
      if (res[0].permission != '' && res != "") {
        resultButton = res[0]
      }
    } else {
      resultButton = '未设置按钮权限'
    }
  })

  const sqlRole = `SELECT *
                   FROM role
                   WHERE id = ?`
  await SySqlConnect(sqlRole, [resultButton.role]).then((response) => {
    resultButton.permissionName = response[0]
  })
  await SySqlConnect(sql, [id]).then((response) => {
    res.status(200).json({
      code: 200,
      message: '获取信息成功',
      data: {
        routerInfo: response[0],
        buttonPermission: resultButton
      }
    })
  })
}
// 确认修改节点
exports.changeRouterInfo = async (req, res, next) => {
  try {
    const {id, pid, component, path, sort, title, icon, name, redirect, alwaysShow, affix, button, roleId} = req.body
    const infoSql = `UPDATE permission_router
                     SET pid            = ?,
                         sort           = ?,
                         component      = ?,
                         path           = ?,
                         title          = ?,
                         icon           = ?,
                         name           = ?,
                         redirect       = ?,
                         alwaysShow     = ?,
                         affix          = ?,
                         updated_router = ?
                     WHERE id = ?`
    const btnSql = 'UPDATE permission_router_button SET permission = ?,updated_button = ? WHERE router_id = ? AND role = ?'
    await SySqlConnect(infoSql, [pid, sort, component, path, title, icon, name, redirect, alwaysShow, affix, changeUpdatedTime(), id])
    await SySqlConnect(btnSql, [button, changeUpdatedTime(), id, roleId]).then(() => {
      res.status(200).json({
        code: 200,
        message: '修改成功'
      })
    })
  } catch (err) {
    next()
  }
}
// 添加节点
exports.addRouter = async (req, res, next) => {
  let insertId, roleId, userId = ""
  // 解密token,获取userid
  jwtUtils.verify(req.headers.x_token, jwt).then((response) => {
    roleId = response.roleId
  })
  // 解构参数数据
  const {router_name, router_icon, router_component, router_path, router_sort, router_title, router_redirect, router_alwaysShow, router_affix, router_father, role} = req.data
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
  let post = [buttonPermission, role, insertId, getTime().created, getTime().updated]
  const sqlRouterButton = `INSERT INTO permission_router_button (permission, role, router_id, created_button, updated_button)
                           VALUES (?, ?, ?, ?, ?)`
  await SySqlConnect(sqlRouterButton, post).then((response) => {
    res.status(200).json({
      code: 200,
      message: '节点添加成功'
    })
  })
}
// 删除路由
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
    await SySqlConnect(sqlBtn, sqlArr).then((response) => {
      res.status(200).json({
        code: 200,
        message: '节点删除成功'
      })
    })

  } catch (err) {
    res.status(500).json({
      error: err
    })
  }
}
// 获取父级节点
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


// 管理员管理

// 获取所有管理员
exports.getAllAdmin = async (req, res, next) => {
  const sql = `SELECT *
               FROM user_info,
                    userinfo,
                    role
               WHERE userinfo.pid = user_info.id
                 AND (
                 userinfo.role = role.id
                 )`
  await SySqlConnect(sql).then((response) => {
    let result = response
    let del = ['password', 'pid', 'updated', 'role_router', 'sort']
    del.forEach((val) => {
      delete result[val]
    })
    res.status(200).json({
      code: 200,
      message: "管理员列表获取成功",
      data: [...result]
    })
  })
}
// 添加管理员
exports.addAdmin = async (req, res, next) => {
  const {account, username, avatar, role, email, usercop,password} = req.body.data
  const newPass = hamc(password)

  const insertAccount = `INSERT INTO \`nodejs\`.\`user_info\` (\`username\`, \`account\`, \`email\`, \`avatar\`, \`password\`, \`created\`, \`updated\`)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`

  const inserInfo = `INSERT INTO \`nodejs\`.\`userinfo\` (\`pid\`, \`role\`, \`usercop\`, \`name\`, \`created\`, \`updated\`) VALUES (?, ?, ?, ?, ?, ?)`
  const accountResult =  await SySqlConnect(insertAccount,[username,account,email,avatar,newPass,getTime().created,getTime().updated]).then(res => {
    if(res) {
      return res.insertId
    }
  })
  await SySqlConnect(inserInfo,[accountResult,role,usercop,NULL,getTime().created,getTime().updated]).then((response) => {
    if(response){
      res.status(200).json({
        code: 200,
        message: '管理员添加成功'
      })
    }
  })
}
// 修改管理员获取信息
exports.changeAdminGetInfo = async (req, res, next) => {
  res.status(200).json({
    code: 200,
    message: "信息获取成功",
  })
}
// 修改管理员
exports.changeAdmin = async (req, res, next) => {
  res.status(200).json({
    code: 200,
    message: "修改成功",
  })
}
// 删除成功
exports.deleteAdmin = async (req, res, next) => {
  const {id} = req.query
  const sql = `DELETE
               FROM \`nodejs\`.\`userinfo\`
               WHERE \`id\` = ?`

  await SySqlConnect(sql, [id]).then((response) => {
    if (response) {
      res.status(200).json({
        code: 200,
        message: "删除成功",
      })
    }
  })

}

