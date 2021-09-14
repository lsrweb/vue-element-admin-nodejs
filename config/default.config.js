module.exports = {
  host: {
    hostname: '123.57.150.75',
    username: 'nodejs',
    password: 'GAF7JhN4ZnDHy7hH',
    database: 'nodejs',
    port: 3306
  },
  baseUrl: 'http://express.api.srliforever.ltd',
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

