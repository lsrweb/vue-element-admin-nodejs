// 错误处理
const utils = require('util')

module.exports = () => {
  return (error, request, response, next) => {
    response.status(500).json({
      error:utils.format(error)
    })
    next()
  }
}
