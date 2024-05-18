const express=require('express');
const routs=express.Router();
const mongoose=require('mongoose');
const User=require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const requireLogin = require('../middlewares/requireLogin');

routs.post('/signup',async(req,res)=>{
    try {
        const { email,name,username,password } = req.body; // Extract all fields from request body
        if(!name||!email||!username||!password){
            return res.status(400).json({message:'please enter all fields'})
        }
        let existEmail=await User.findOne({$or:[{email:email},{username:username}]});
        if(existEmail){
            return res.status(400).json({message:'User already Exist with that email or username',status:0});
        }else{
            req.body.password=await bcrypt.hash(password,10);
            let userData=await User.create(req.body);
            if(userData){
                res.status(200).json({message:'User Registered Successfully !',status:1,data:userData});
            }else{
                res.status(400).json({message:'user not created',status:0});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'Something Wrong',status:0});
    }
})

routs.post('/signin',async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:'please enter all fields',status:0});
        }else{
            let checkEmail = await User.findOne({email:email});
            // console.log(checkemail)
            if(checkEmail){
                let checkPassword=await bcrypt.compare(password,checkEmail.password);
                if(checkPassword){
                    var token=jwt.sign({_id:checkEmail.id},process.env.JWT_SECRET,{expiresIn:'24h'})
                    const {_id,name,email,username}=checkEmail;
                    return res.status(200).json({message:'user login successfully',status:1,data:checkEmail,token:token,user:{_id,name,email,username}});
                }else{
                    return res.status(400).json({message:'Password Not Match',status:0});
                }
            }else{
                return res.status(400).json({message:'User Not Found',status:0});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'Something Wrong',status:0});
    }
})

module.exports=routs;