//权限的控制
//用来检查用户登录
function checklogin(req,res,next) {
    if(req.session.user){
        //已登录
        next()
    }else {
        //未登录
        req.flash('status',['当前操作只有登录后执行，请先登录','warning'])
        res.redirect('/users/login')
    }
}
function checkNotlogin(req,res,next) {
    if(req.session.user){
        //已登录
        req.flash('status',['当前操作只有未登录后执行，请先退出','warning'])
        res.redirect('/')
    }else {
        //未登录
        next()
    }
}
module.exports = {
    checklogin:checklogin,
    checkNotlogin:checkNotlogin
}