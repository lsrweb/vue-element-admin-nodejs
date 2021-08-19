const {SySqlConnect} = require("../model");

exports.getIndexData = (req, res, next) => {
  try {

  } catch (err) {
    next()
  }
}
// 获取todo列表
exports.todo = async (req, res, next) => {
  try {
    const sql = `SELECT *
                 FROM to_do;`
    SySqlConnect(sql).then((response) => {
      res.status(200).json({
        message: 'To Do List 获取成功',
        code: 200,
        data: response
      })
    })
  } catch (err) {
    next()
  }
}
// 添加todo
exports.addtodos = async (req, res, next) => {
  try {
    const {text} = req.body
    const sql = `INSERT INTO express.to_do (text, done, created, updated)
                 VALUES ('${text}', '0', '${new Date().getTime()}', '${new Date().getTime()}')`
    SySqlConnect(sql).then((response) => {
      if (response) {
        res.status(200).json({
          code: 200,
          message: '条目添加成功'
        })
      }
    })
  } catch (err) {
    next()
  }
}
// 删除todo
exports.deleteTodo = async (req, res, next) => {
  try {
    const {id} = req.query
    const sql = `DELETE
                 FROM to_do
                 WHERE id = ${id}`

    SySqlConnect(sql).then((response) => {
      if (response) {
        res.status(200).json({
          code: 200,
          message: '删除成功'
        })
      }
    })

  } catch (err) {
    next()
  }
}
