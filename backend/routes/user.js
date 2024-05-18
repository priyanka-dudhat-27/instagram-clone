const express = require('express');
const routes = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel');
const requireLogin = require("../middlewares/requireLogin");

// Get user profile
routes.get('/:id', async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.params.id }).select('-password');
        if (userData) {
            let postData = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id").exec();
            if (postData) {
                return res.status(200).json({ userData, postData });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Something Wrong', status: 0 });
    }
});

// Follow user
routes.put("/follow", requireLogin, async (req, res) => {
    try {
        // Add follower to user's followers list
        await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, { new: true });

        // Add followed user to current user's following list
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Unfollow user
routes.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Remove follower from user's followers list
        await User.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user._id }
        }, { new: true });

        // Remove followed user from current user's following list
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// to upload profile pic
routes.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate(req.user._id,{ 
            $set: { photo: req.body.pic } 
        },{ 
            new: true
        }).exec();

        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong', status: 0 });
    }
});
module.exports = routes;
