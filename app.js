var express = require('express');
var path = require('path');
//用来处理ico图标的模块
var favicon = require('serve-favicon');
//用来输出日志
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var session = require("express-session");
//引入connect-mongo模块
var MongoStore = require("connect-mongo")(session);

var index = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
//引入flash模块后，可以使用req.flash模块
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//使用日志模块
app.use(logger('dev'));
//使用body-parser模块
app.use(bodyParser.json());
//处理表单请求；extended: false用不用queryString解析url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//设置静态资源文件根路径
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({
        url:require('./dbUrl').dbUrl
    })
}));
//flash 依赖于session,读一次后即清空
app.use(flash());

app.use(function (req,res,next) {
    var isLogin = req.session.user!=null?true:false;
    var username = req.session.user!=null?req.session.user.username:"";
    res.locals.isLogin = isLogin;
    res.locals.username = username;
    res.locals.info = req.flash('status');
    next()
})
app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
//错误处理中间件，传递一个err参数
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    //给模板引擎文件传递数据，同render方法的第二个对象参数相同
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
