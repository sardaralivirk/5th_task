const user=require('../models/userSchema')
const bcrypt = require('bcrypt');
const Post = require('../models/userpostschema');
const commentrecord=require('../models/comment_record')
var jwt = require('jsonwebtoken');
const { response } = require('express');
const SecretKey  = "12315";

const createuser=async(req,res)=>{

    const {name,username,email,password,post_id}=req.body;
    const find=await user.findOne({email,username})
    if (find) {
        console.log(find)
        return res.json({message:"user already exits "})
        
    } else {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const add=await user.create({name,username,email,post_id,password:hash})
    return res.json({message:'create a new user'})

    }
    
}
const login=async(req,res)=>{
         const {username,email,}=req.body
         const find=await user.findOne({username})
         const find2=await user.findOne({email})

         if (find||find2){
            const token=jwt.sign(email, SecretKey)
            res.json({message:'user login',token})
         } 
         else{
            res.json({message:'user not found in db'})
         }
}

const postcreate= async (req,res) => {

    const{like,comment,user_id,name,contact}=req.body
    const add= await Post.create({like,comment,user_id, name,contact})
    res.json({message:"user create a post"})
    
}
const like=async (req,res) => {
    const{user_id,post_id}=req.body
    const find=await Post.findOne({_id:post_id})
    console.log(find)
    if (!find.likes) {
        find.likes = [];
      }
      if (find.likes.includes(user_id)) {
        return res.status(400).send('You already liked this post');
      }
    find.likes.push(user_id);
    if (!find.likesCount) {
        find.likesCount = 0;
      }
     find.likesCount += 1;
    await find.save();
    res.status(200).json({message:"your user whose like the post:",find});
    
}

const allpost=async (req,res) => {

    const find= await Post.find()
    
    res.json({message:"all posst are availlable",find})

}
const deletepost=async (req,res) => {

    const {user_id}=req.bod
    const find=await Post.findOneAndDelete({user_id})
    res.json({message:'user has been delete'})
    
}

const comment=async (req,res) => {
    const {user_id,post_id,commentss}=req.body
    const find=await Post.findOne({_id:post_id})
    console.log(find,  '-----------------101--------------- ')
    //console.log(find)
    if(!find.comment){
        find.comment=[]
    }
    find.comment.push({user_id,commentss});
    if(!find.Count_comment){
        find.Count_comment=0;
    };
    find.Count_comment +=1;
     await find.save();


    res.json({message:'okay',find})
    
}

const comment_record=async (req,res) => {
    const {user_id,post_id,comments}=req.body
    const find=await Post.findOne({_id:post_id})

    if(find){
       const newComment = await commentrecord.create({user_id:user_id,post_id:find._id,comments:comments})

       await Post.updateOne({ _id: post_id }, { $inc: { Count_comment:1 } })
      // await Post.findByIdAndUpdate(post_id, { $inc: { Count_comment:1 } }, { new: true })
        // res.json({message:"comment on your post",newComment})
        // const find2=await commentrecord.find({post_id})
        res.status(200).json({message:"Complete"})
    }
    //  await find.save();
    
    
}

// const findLikes=async (req,res) => {
//   const {post_id}=req.body
//   const find=await Post.findById(post_id).populate('likes','name');
//   const likedUserNames = find.likes.map(user=> user.name)
//   res.status(200).json({message:'whose like your post',likedUserNames})
// }


const findLikes = async (req, res) => {
    const { post_id } = req.body;

    try {
        // Find the post by ID and populate the 'likes' field with user details
        const post = await Post.findById(post_id).populate('likes').select('name email username')
        console.log(post)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Extract user names from the populated 'likes' field
        const likedUserNames = post.likes.map((user) =>{
            return { name:user.name,email:user.email,username:user.username}
        });

        res.status(200).json({ message: 'Users who liked the post', likedUserNames });
    } catch (error) {
        console.error('Error fetching post likes:', error);
        res.status(500).json({ message: 'Error fetching post likes', error });
    }
};

const userLikePost=async (req,res) => {
    const {user_id}=req.body;
    const find=await Post.find({'likes':user_id})
    const likedUserNames =find.map((post) =>post._id);

    // if(user_id==find.likes){
    //     return res.status.json({message:'your post which one you like'})
    // }
    return res.status(200).json({message:'all posts here',likedUserNames})
}


const alluser = async (req, res) => {
    try {
        // Fetch users and populate the 'post_id' field with posts and their likes
        const users = await user.find()
            .populate({
                path: 'post_id',  // The field to populate
                select: 'name contact likes',  // Fields to include from the Post collection
                populate: {
                    path: 'likes',  // Populate the 'likes' field
                    select: 'name'  // Include only the 'name' field from the Like collection
                }
            })
            .select('name post_id contact');  // Fields to include from the User collection

        // Map users to include necessary data
        const usersWithPosts = users.map(user => ({
            user_name: user.name,
            post: user.post_id ? {
                postName: user.post_id.name,
                PostContact: user.post_id.contact,
                likes: user.post_id.likes.map(like => like.name)  // Extract names of likes
            } : null
        }));

        // Send response with all users and their posts
        return res.status(200).json({
            message: "All users with their posts are found",
            users: usersWithPosts
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
//feature

};

    




module.exports={createuser,login,postcreate,like,allpost,deletepost,comment,comment_record,findLikes,userLikePost,alluser}