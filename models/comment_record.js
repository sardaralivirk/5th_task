const mongoose=require('mongoose')
const comment_recor = new mongoose.Schema({
     
    user_id:{type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', },
    post_id:{type: mongoose.Schema.Types.ObjectId,
        ref: 'User', },

    comments:String,
    //count_comment:{type:Number,default:0}
    
});

const comment_record= mongoose.model('comment_record', comment_recor);

module.exports = comment_record;