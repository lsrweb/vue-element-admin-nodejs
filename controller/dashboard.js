const {SySqlConnect} = require("../model");
const {response} = require("express");

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
// 修改todo文字
exports.updatedTodo = async (req, res, next) => {
  try {
    const {id,text} = req.body
    const sql = `UPDATE to_do
                 set text = "${text}"
                 where id = ${id};`

    SySqlConnect(sql).then((response) => {
      if(response) {
        res.status(200).json({
          code: 200,
          message: '修改成功'
        })
      }
    })
  } catch (err) {
    next()
  }
}
// 修改todo 状态
exports.updatedTodoActive = async (req,res,next) => {
  try {
  //  up 正在吃饭...
    const { id,done } = req.query
    if(!id || !done) {
      res.status(403).json({
        code: 403,
        message: '请传入参数'
      })
    }
    const sql = `UPDATE to_do SET  done = '${done}' WHERE id = ${id}`
    SySqlConnect(sql).then((response) => {
      if(response){
        res.status(200).json({
          code: 200,
          message: '已修改'
        })
      }
    })

  } catch (err) {

  }
}
