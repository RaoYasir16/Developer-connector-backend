const express = require("express");
const router = express.Router();

const { createPost, getPosts, getSinglPost, updatePost,
       deletePost, togglelikePost, addComment, 
       deleteComment} =
       require("../controllers/postController")

const userAuth = require("../middleware/auth");

//Create Post
router.post("/create-posts",userAuth,createPost);
//Get all Posts
router.get("/get-posts",userAuth,getPosts);
//Get Single Post
router.get("/singpost/:id",userAuth,getSinglPost);
//updatePost
router.put("/update-post/:id",userAuth,updatePost);
//Delete Post
router.delete("/delete-post/:id",userAuth,deletePost);

//toggle Post Like/UnLike
router.put("/post-like/:id",userAuth,togglelikePost);

//add comment 
router.put("/post/add-comment/:id",userAuth,addComment);
//delete Comment
router.delete("/delete-comment/:id/:comment_id",userAuth,deleteComment)

module.exports = router