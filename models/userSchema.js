const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username:{
        type:String,
        lowercase:true
    },
    password: String,
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' 
    },
    
});

const User = mongoose.model('User', userSchema);
module.exports = User;