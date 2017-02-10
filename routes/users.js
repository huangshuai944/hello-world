var express = require("express");
var userModel = require("../mongodb/db").userModel;
var auth = require('../middleware/auth');
var router = express.Router();
//MD5加密模块
var md5 = require('../md5');

var multer = require('multer');
var storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,'../public/uploads/avatar')
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname)
    }
})
var upload = multer({storage:storage})
//注册页
router.get('/login',auth.checkNotlogin,function (req,res) {
    res.render("users/login1",{title:"登录页"})
})
router.post('/login',auth.checkNotlogin,function (req,res) {
    var user = req.body;
    user.password = md5(user.password)
    userModel.findOne(user,function (err,doc) {
        if (err) {
            //查找出错
          res.redirect('back');
          req.flash("status",["登录失败",'danger']);
        } else {
            if(doc) {
                //登录成功
                req.session.user = doc;
                req.flash("status",["登录成功",'success']);
                res.redirect('/');
            }else {
                //未查找到用户
                req.flash("status",["登录失败，该用户不存在，请先注册",'warning']);
                res.redirect('/users/register')
            }
        }
    })
})
//登录
router.get('/register',auth.checkNotlogin,function (req,res) {
    res.render("users/register",{title:"注册页"})
});
//接受注册信息
router.post('/register',auth.checkNotlogin,upload.single('avatar'),function (req,res) {
    var user = req.body;
    user.password = md5(user.password);
    if(req.file){
        user.avatar = '/uploads/avatar/'+req.file.filename
    }else{
        user.avatar = '/images/header_img.jpg'
    }
    userModel.findOne(user,function (err,doc) {
        if(doc) {
            req.flash("status",["注册失败，该用户已存在",'warning']);
            res.redirect('back');
        }else {
            userModel.create(user,function (err,doc) {
                if (err) {
                    req.flash("status",["注册失败",'danger']);
                } else {
                    req.session.user = doc;
                    req.flash("status",["注册成功！",'success']);
                    res.redirect('/');
                }
            })
        }
    })
})
//退出
router.get ('/logout',auth.checklogin,function (req,res) {
    req.session.user = null;
    res.redirect('/');
})
module.exports = router;
