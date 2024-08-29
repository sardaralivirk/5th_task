const express=require('express')
const router=express.Router()
const {createuser,login,postcreate, like,allpost,deletepost,comment,comment_record,findLikes,userLikePost,alluser,aggregation_findpost}=require('../controller/controller')
router.post('/createuser',createuser)
router.post('/postcreate',postcreate)
router.post('/login',login)
router.get('/allpost',allpost)
router.post('/like',like)
router.delete('/deletepost',deletepost)
router.post('/comment',comment)
router.post('/comment_recoed',comment_record)
router.get('/findLikes',findLikes)
router.get('/userLikePost',userLikePost)
router.get('/alluser',alluser)
router.get('/findpost/get',aggregation_findpost)


module.exports=router;