const mongoose = require("mongoose");
const User = require("../models/userModel");
const PostSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes:[{
    type:mongoose.Types.ObjectId,
    ref:"User",
  }],
  comments:[{
    comment:{type:String},
    postedBy:{type:mongoose.Types.ObjectId,ref:"User"}
  }],
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  created_date: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
