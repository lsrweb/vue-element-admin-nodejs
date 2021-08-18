process.env.PORT = 8000;
const path = require('path')
const express = require('express')
const app = express()
const errorHandler = require('./middleware/error-handler')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./router/index')
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const port = process.env.PORT || 8993
require('./model/index')
app.use(morgan('dev'))


app.use(cors())
// // 处理json 数据
app.use(express.json());
// 处理 form-urllencoded数据
app.use(express.urlencoded({
  extended: true
}));
// 处理 multipart 数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(multipartMiddleware)




// 挂载路由
app.use('/api', router)

// 配置静态资源
app.use(express.static(__dirname + '/public'));

// 配置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index');
})

app.use(function (req, res) {
  if (req.accepts('html')) {
    res.render('404');
    return;
  }
});
// 错误挂载
app.use(errorHandler())

app.listen(port, () => {
  console.log(`运行成功${port}`);
})

module.exports = app;
