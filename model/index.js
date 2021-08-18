const mysql = require('mysql')
const {host} = require('../config/default.config.js')
const pool = mysql.createPool({
  host: host.hostname,
  port: host.port,
  user: host.username,
  password: host.password,
  database: host.database,
  ispool: true,
  connectionLimit: 10,
  acquireTimeout: 3000
});

module.exports = {
  //连接池对象
  query: (sql, callback) => {
    pool.getConnection(function (err, connection) {
      connection.query(sql, function (err, data) {
        callback(err, data);
        //释放链接
        connection.release();
      });
    });
  },
  //promise 回调
  SySqlConnect: (sySql, sqlArr) => {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, conn) {
        if (err) {
          reject(err);
        } else {
          conn.query(sySql, sqlArr, (err, data) => {
            if (err) {
              reject(err)
            } else {
              let string = JSON.stringify(data)
              let ResultData = JSON.parse(string)
              resolve(ResultData);
            }
            conn.release();
          });
        }
      })
    }).catch((err) => {
      console.log(err);
    })
  }
}
