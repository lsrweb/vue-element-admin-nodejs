const crypto = require('crypto')

// 散列密码加密算法
// function createHmac(str) {
//   const key = Math.random().toString().slice(-6);
//   const result = crypto.createHmac("sha1", key).update(str).digest("hex");
//   return result
// }

// MD5 加密
function md5(str) {
  const result = crypto.createHash('md5').update('lsr' + str).digest('hex')
  return result
}

module.exports = str => {
  // return createHmac(str)
  return md5(str)

}
