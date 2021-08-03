// token 认证
const {
  verify
} = require('../utils/jwt')
const {
  jwtScriptId
} = require('../config/config.default')
const {
  User
} = require('../model')

module.exports = async (req, res, next) => {
  // 请求头获取
  const token = req.headers['authorization'] || req.headers['token']
  if (!token) {
    return res.status(401).json({
      message: '无身份认证Token'
    }).end()
  }
  // 验证token 是否有效
  try {
    const decodedToken = await verify(token, jwtScriptId)
    const userInfo = await User.findById(decodedToken.userId)
    req.user = userInfo
    next()
  } catch (err) {
    return res.status(401).json({
      msg: '无效token'
    })
  }

}
