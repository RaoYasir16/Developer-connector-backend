const Post = require("../models/postModel");
const User = require("../models/userModel");

// @desc    Create a post
// @route   POST /user/creat-posts
// @access  Private
const createPost = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        const newPost = await Post.create({
            title:req.body.title,
            text:req.body.text,
            username:user.username,
            avatar:user.avatar,
            user_id:req.user.id
        });

        return res.status(200).json({
            message:"Post Created Successfylly",
            newPost
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
}

// @desc    GET all posts
// @route   GET /user/get-posts
// @access  Private
const getPosts = async(req,res)=>{
    try {
        const allPost = await Post.find({ user_id: req.user.id });

        if(!allPost || allPost.length ===0 ){
            return res.status(404).json({
                message:"No post found"
            });
        }

        return res.status(200).json(allPost)
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
}

// @desc    GET a post
// @route   GET /user/getsingl-post/:id
// @access  Private
const getSinglPost = async (req,res)=>{
    try {
        const postId = req.params.id
        const singlPost = await Post.findOne({_id:postId, user_id:req.user.id});
        if(!singlPost){
            return res.status(404).json({
                message:"Post Not found"
            });
        }

        return res.status(200).json(singlPost)
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
} 

// @desc    GET a post
// @route   GET /user/getsingl-post/:id
// @access  Private
const updatePost = async(req,res)=>{
    try {
        const userId = req.user.id
        const postId =req.params.id

        const post = await Post.findOne({user_id:userId, _id:postId});
        if(!post){
            return res.status(404).json({
                message:"Unothorized: Post not found"
            });
        }

        const updatePost = await Post.findByIdAndUpdate(
            postId,
            req.body,
            {new:true}
        );

        return res.status(200).json({
            message:"Post update Successfully",
            updatePost
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Delete a post
// @route   delete /user/delete-post/:id
// @access  Private
const deletePost = async(req,res)=>{
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const existingPost = await Post.findOne({user_id:userId,_id:postId});
        if(!existingPost){
            return res.status(404).json({
                message:"Post not Found: Unotherized"
            });
        }

        await Post.deleteOne({postId});
        return res.status(200).json({
            message:"Post Deleted Sucessfully",
            existingPost
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Like/unlike a post
// @route   Put /user/toggle-like/:id
// @access  Private
const togglelikePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({
                message:"Post Not found"
            });
        }
        const alreadyLiked = post.likes.some(like=>like.user.toString() === req.user.id);
        if(alreadyLiked){
            post.likes = post.likes.filter(like=>like.user.toString() !== req.user.id);
            await post.save();
            return res.status(200).json({
                message:"Post Unliked",
                likes:post.likes
            });
        }else{
            post.likes.unshift({user:req.user.id});
            post.save();
            return res.status(200).json({
                message:"Post Liked",
                likes:post.likes
            });
        }


    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Comment on a post
// @route   Put /user/post/comment/:id
// @access  Private
const addComment = async(req,res)=>{
    try {
        
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message:"Post Not found"
            });
        }
        const text = req.body.text
        if(!text){
            return res.status(400).status({
                messge:"Enter comment"
            })
        }
         const comment = {
            user:req.user.id,
            text
         };

         post.comments.unshift(comment);
         await post.save();
         return res.status(200).json({
            message:"comment added",
            comments:post.comments
         })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc     Delete Comment on a post
// @route   Put /user/post/comment/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id); 
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const comment = post.comments.find(
        comm => comm._id.toString() === req.params.comment_id
      );
  
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Unauthorized: You can't delete this comment",
        });
      }
  
      // Remove the comment
      post.comments = post.comments.filter(
        comm => comm._id.toString() !== req.params.comment_id
      );
  
      await post.save();
  
      return res.status(200).json({
        message: "Comment Deleted",
        comments: post.comments,
      });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {createPost,getPosts,getSinglPost,updatePost,deletePost,
                 togglelikePost,addComment,deleteComment
                    }