const express = require("express");
const requireLogin = require("../middlewares/requireLogin");
const routs = express.Router();
const Post = require("../models/postModel");
const moment = require("moment");

routs.post("/createPost", requireLogin, async (req, res) => {
  const { image, body } = req.body;
  console.log(image);
  if (!image || !body) {
    return res
      .status(400)
      .json({ message: "please fill all fields", status: 0 });
  }
  try {
    req.body.postedBy = req.user;
    console.log(req.user);
    req.body.created_date = moment().format("LLL");
    const postData = await Post.create(req.body);
    if (postData) {
      return res
        .status(200)
        .json({
          message: "Post Created Successfully",
          status: 1,
          data: postData,
        });
    } else {
      return res.status(400).json({ message: "Post Not Created", status: 0 });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

routs.get("/allposts", requireLogin, async (req, res) => {
  try {
    let postData = await Post.find().populate("postedBy", "_id username photo").populate("comments.postedBy", "_id name").sort("-createdAt");
    if (postData) {
      return res.status(200).json({ data: postData });
    } else {
      return res.status(400).json({ message: "Data not found !", status: 0 });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

routs.get("/mypost", requireLogin, async (req, res) => {
  try {
    let postData = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id username"
    ).sort("-createdAt");
    if (postData) {
      return res.status(200).json({ data: postData });
    } else {
      return res.status(400).json({ message: "Data not found !", status: 0 });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

routs.put("/like", requireLogin, async (req, res) => {
  try {
    let data = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    ).populate("postedBy","_id username photo")
    .exec();
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

// like&unlike
routs.put("/unlike", requireLogin, async (req, res) => {
  try {
    let data = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    ).populate("postedBy","_id username photo")
    .exec();
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

// comment
routs.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };
    let data = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedBy", "_id username image")
      .populate("postedBy", "_id username photo")
      .exec();
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
});

// delete post
routs.delete("/deletepost/:postId",requireLogin,async(req,res)=>{
  try {
    const postId=req.params.postId;
    let delData=await Post.findByIdAndDelete({_id:postId})
    if(delData){
      return res.status(200).json({message:"Post Deleted Successfully",status:1})
    }else{
      return res.status(400).json({message:"Post Not Deleted",status:0})
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
})

// to show following posts
routs.get("/myfollowingpost",requireLogin,async(req,res)=>{
  try {
    let postData=await Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id username")
    .populate("comments.postedBy","_id username")
    .then((posts)=>res.json(posts))
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something Wrong !", status: 0 });
  }
})

module.exports = routs;

