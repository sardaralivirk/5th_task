const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    like: String,
    comment: String,
    name:String,
    contact:String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Ensure this matches the model name for users
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      }],
      likesCount:{
        type:Number,
        default:0
      },
      // comment: [{
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'User', // Reference to the User model
      //   commentss:String
      // }],
      Count_comment:{
        type:Number,
        default:0,
        
        
      },
      //total_comment:{type:Number,default:0}
});

postSchema.pre('save', function(next) {
  if (this.isModified('Count_comment')) {
      this.Count_comment = this.Count_comment.length;
  }
  next();
});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
