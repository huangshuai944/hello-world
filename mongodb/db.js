var mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(require('../dbUrl').dbUrl);
var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    avatar:String
})
var articleSchema = new mongoose.Schema({
    time:Number,
    title:String,
    content:String,
    viewTime:{
        type:Number,
        default:0
    },
    likeTime:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    poster:String
})
var commentSchema = new mongoose.Schema({
    time:Number,
    content:String,
    article:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"article"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})
var userModel = mongoose.model('user',userSchema);
var articleModel = mongoose.model('article',articleSchema);
var commentModel = mongoose.model('comment',commentSchema);
module.exports = {
    userModel:userModel,
    articleModel:articleModel,
    commentModel:commentModel
}

