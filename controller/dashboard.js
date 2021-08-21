const {SySqlConnect} = require("../model");
const path = require('path');
const fs = require('fs')
const {filterImage, filterImageSize, formTime, filterFileSize} = require("../utils");

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
    const {id, text} = req.body
    const sql = `UPDATE to_do
                 set text = "${text}"
                 where id = ${id};`

    SySqlConnect(sql).then((response) => {
      if (response) {
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
exports.updatedTodoActive = async (req, res, next) => {
  try {
    const {id, done} = req.query
    if (!id || !done) {
      res.status(403).json({
        code: 403,
        message: '请传入参数'
      })
    }
    const sql = `UPDATE to_do
                 SET done = '${done}'
                 WHERE id = ${id}`
    SySqlConnect(sql).then((response) => {
      if (response) {
        res.status(200).json({
          code: 200,
          message: '已修改'
        })
      }
    })

  } catch (err) {

  }
}

// 单图片上传
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(403).json({
        code: 1,
        message: '请上传图片'
      })
    } else {
      let file = req.file;
      let filetype = filterImage(file.mimetype)
      let fileSize = filterImageSize(file.size)
      if (!filetype) {
        res.status(400).json({
          code: 400,
          message: '图片格式错误!'
        })
        return false
      }
      if (!fileSize) {
        res.status(400).json({
          code: 400,
          message: '上传图片太大了'
        })
        return false
      }
      const folder = formTime(new Date())
      const extname = path.extname(file.originalname)
      const filename = `${new Date().getTime()}${+new Date().getTime() * Math.random()}`
      await fs.access(`./public/uploads/${folder}`, (callback) => {
        if (callback != null) {
          fs.mkdirSync(`./public/uploads/${folder}`)
        }
      })
      await fs.renameSync(`./public/uploads/${folder}/${file.filename}`, `./public/uploads/${folder}/${filename}${extname}`);
      res.send({
        code: 200,
        msg: '上传成功',
        location: `/uploads/${folder}/${filename}${extname}`
      });
    }
  } catch (err) {
    next()
  }
}
// 多图上传
exports.uploadsImage = async (req,res,next) => {
  if(req.files.length === 0){
    res.status(403).json({
      code: 1,
      message: '请上传图片'
    })
  }else{
    let filsPath = ""
    for(let i in req.files){
      let file = req.files[i];
      const folder = formTime(new Date())
      const extname = path.extname(file.originalname)
      const filename = `${new Date().getTime()}${+new Date().getTime() * Math.random()}`
      await fs.access(`./public/uploads/${folder}`, (callback) => {
        if (callback != null) {
          fs.mkdirSync(`./public/uploads/${folder}`)
        }
      })
      await fs.renameSync(`./public/uploads/${folder}/${file.filename}`, `./public/uploads/${folder}/${filename}${extname}`);
      filsPath = `uploads/${folder}/${filename}${extname}`
    }
    //批量存储到数据库
    res.status(200).json({
      code: 200,
      message: '上传成功',
      data: filsPath

    })

  }
}
// 全局文件上传
exports.uploadFile = async (req, res, next) => {
  if (!req.file) {
    res.status(403).json({
      code: 1,
      message: '请上传文件'
    })
  } else {
    let file = req.file;
    let fileSize = filterFileSize(file.size)
    if (!fileSize) {
      res.status(400).json({
        code: 400,
        message: '上传文件太大了'
      })
      return false
    }
    const folder = formTime(new Date())
    const extname = path.extname(file.originalname)
    const filename = `${new Date().getTime()}${+new Date().getTime() * Math.random()}`
    await fs.access(`./public/files/${folder}`, (callback) => {
      if (callback != null) {
        fs.mkdirSync(`./public/uploads/files/${folder}`)
      }
    })
    await fs.renameSync(`./public/files/${folder}/${file.filename}`, `./public/files/${folder}/${filename}${extname}`);
    res.send({
      code: 200,
      msg: '上传成功',
      data: `/files/${folder}/${filename}${extname}`
    });
  }
}

