module.exports = {
  host: {
    hostname: 'localhost',
    username: 'root',
    password: 'admins',
    database: 'express',
    port: 3306
  },
  baseUrl: 'http://127.0.0.1:8000',
  // 是否验证密码格式
  validatePassword: false,
  // token 密钥
  jwt: 'siriforever.ltd@gamil.com&20010729&2975971434',
  // 图片格式限制
  photeFilter: ['image/png', "image/jpeg", 'image/gif', "image/webp"],
  // 图片 / 文件 大小限制 (MB)
  fileSize: 5,
  filesSize: 20


}
