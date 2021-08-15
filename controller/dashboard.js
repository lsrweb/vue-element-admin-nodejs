const {SySqlConnect} = require("../model");

exports.getIndexData = (req, res, next) => {
  try {
    let sql = 'SELECT * FROM test'
    let sqlArr = []
    SySqlConnect(sql, sqlArr).then((response) => {
      res.status(200).json({
        message: '数据获取成功',
        code: 200,
        data: response
      })
    })
  } catch (err) {
    next()
  }
}

