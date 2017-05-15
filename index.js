var express = require('express');  // nodejs 模版
var path = require('path'); // 路径包
var favicon = require('serve-favicon');
var ejs=require("ejs"); //模版引擎

var session=require("express-session");
var bodyParser = require('body-parser');  // 字符编码


// 定义路由
var login=require("./routes/login.js");
var admin=require("./routes/admin.js");
var index=require("./routes/index.js");

// 创建express对象
var app = express();

// view engine setup 初始化模版引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'cyy',
    resave: true,
    saveUninitialized: true
}))

app.use("/login",login);
app.use("/",index);
app.use("/admin",admin);

app.listen(18080);
