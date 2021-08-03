const mysql = require('mysql')
const {
  host
} = require('../config/default.config.js')
const connection = mysql.createConnection({
  host: host.hostname,
  user: host.username,
  password: host.password,
  database: host.database
})


connection.connect(function (err) {
  if (err) {
    console.log("数据库链接失败");
    throw (err)
  } else {
    console.log("数据库链接成功");
  }
})




connection.end()
