var express = require("express");
var router = express.Router();
var articleModel = require("../mongodb/db").articleModel;
var userModel = require("../mongodb/db").userModel;
//首页
router.get('/',function (req,res) {
    if(req.query.userself){
        console.log(req.session.user._id)
        articleModel.find({user:req.session.user._id}).populate('user').exec(function (err,doc) {
            res.render('index',{title:"首页",articles:doc})
        })
    }
    // console.log(req.session.user)
    else if(req.query.userId){
        articleModel.find({user:req.query.userId}).populate('user').exec(function (err,doc) {
            res.render('index',{title:"首页",articles:doc})
        })
    }else {
        articleModel.find({}).populate('user').exec(function (err,doc) {
            res.render('index',{title:"首页",articles:doc})
        })
    }
})
//查找
router.post('/',function (req,res) {
    var reg = new RegExp(req.body.search,'ig');
    articleModel.find({$or:[
        {title:reg},
        {content:reg}
    ]}).populate('user').exec(function (err,article1) {
        userModel.find({username:reg},function (err,doc) {
            doc.forEach(function (user) {
                articleModel.find({user:user._id}).populate("user").exec(function (err,article2) {
                    var article = quchong(article2.concat(article1));
                    res.render('index',{title:"首页",articles:article})
                })
            })
        })

    })
})
module.exports = router;
function quchong(arr) {
    var newArr = [];
    var idArr = [];
    for(var i=0 ; i<arr.length ; i++){
        if(idArr.indexOf(arr[i]._id.toString())==-1){
            newArr.push(arr[i]);
            idArr.push(arr[i]._id.toString());
        }else{
            continue
        }
    }
    return newArr;
}

