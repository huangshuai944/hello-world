var express = require("express");
var router = express.Router();
var auth = require('../middleware/auth');
var articleModel = require("../mongodb/db").articleModel;
var commentModel =require('../mongodb/db').commentModel;
var markdown = require('markdown').markdown;
//引入图片上传功能
var multer = require('multer');
//配置
var storage = multer.diskStorage({
    //上传后的文件保存路径
    destination:function (req,file,cb) {
      cb(null,'../public/uploads/poster')
    },
    //上传文件的名字
    filename:function (req,file,cb) {
        cb(null,file.originalname)
    }
})
//upload可以视为中间件函数
var upload = multer({storage:storage});
router.get('/add',auth.checklogin,function (req,res) {
    res.render('articles/add',{title:"添加文章"})
})
router.post('/add',auth.checklogin,upload.single('poster'),function (req,res) {

    var obj ={
        time:Date.now(),
        title:req.body.title,
        content:req.body.content,
        user:req.session.user
    }
    //保存了图片上传的信息
    if(req.file){
        //上传了图片
        obj.poster = "/uploads/poster/"+req.file.filename;
    }else {
        obj.poster = '/images/mr.jpg';
    }
    articleModel.create(obj,function (err,doc) {
        if(err) {
            req.flash('status',['添加文章失败','danger']);
        } else {
            req.flash('status',['添加文章成功','success']);
            res.redirect('/')
        }
    })
})
router.get('/detail',auth.checklogin,function (req,res) {
    //需要判断是否为本人的文章
    var _id = req.query.id;
    var pageNum = parseInt(req.query.pageNum)||1;

    articleModel.findById(_id).populate('user').exec(function (err,article) {
        var isSameUser = article.user.username==req.session.user.username?true:false;
        if(req.query.viewTime){
            article.viewTime = parseInt(req.query.viewTime) + 1;
        };
        if(req.query.likeTime){
            article.likeTime = parseInt(req.query.likeTime) + 1;
        }
        // article.content = markdown.toHTML(article.content)
        commentModel.find({article:_id.toString()}).skip((pageNum-1)*5).limit(5).populate("user").exec(function (err,comment) {
            commentModel.count({article:_id.toString()},function (err,count) {
                var totalPage = Math.ceil(count/5);
                res.render('articles/detail',{title:"某用户文章详情页",isSameUser:isSameUser,article:article,comment:comment,totalPage:totalPage,pageNum:pageNum});
            })
            //更新浏览次数
            articleModel.update({_id:_id.toString()},article,function (err,doc) {
            })
        })
    })
})
router.get('/delete',auth.checklogin,function (req,res) {
    var id = req.query.id;
    articleModel.findOneAndRemove({_id:id.toString()},function (err,doc) {
        if (err){
            req.flash('status',['删除失败','danger']);
        }else {
            commentModel.remove({article:id.toString()},function (err,doc) {
                if(err){
                    req.flash('status',['删除失败','danger']);
                }else {
                    req.flash('status',['删除成功','success']);
                    res.redirect('/');
                }
            })
        }
    })
})
router.get('/edit',auth.checklogin,function (req,res) {
    var id = req.query.id;
    articleModel.findById(id.toString(),function (err,doc) {
        res.render('articles/edit',{title:"某用户文章详情页",article:doc});
    })
})
router.post('/edit',function (req,res) {
    var obj ={
        author:req.session.user.username,
        time:Date.now(),
        title:req.body.title,
        content:req.body.content
    };
    articleModel.update({_id:req.query.id.toString()},obj,function (err,doc) {
        if(err) {
            req.flash('status',['修改失败','danger']);
        } else {
            req.flash('status',['修改成功','success']);
            res.redirect('/')
        }
    })
})
router.post('/comment',auth.checklogin,function (req,res) {
    var obj={
        time:Date.now(),
        content:req.body.comment, //评论的内容
        user:req.session.user, //评论者
        article:req.query.id
    }
    commentModel.create(obj,function (err,doc) {
        if(err){
            req.flash('status',['评论失败','danger'])
        }else {
            req.flash('status',['评论成功','success'])
            res.redirect('back')
        }
    })
})
module.exports = router;