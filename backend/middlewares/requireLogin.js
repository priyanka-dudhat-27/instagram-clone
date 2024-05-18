
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User=require('../models/userModel')
module.exports=async(req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(400).json({message:'You have to login first',status:0})
    }
    const token=authorization.replace('Bearer ','');
    // console.log(token);
    jwt.verify(token,process.env.JWT_SECRET,async (err,payload)=>{
        if(err){
            return res.json({message:'Invalid or Expired token,Please Login again',status:0})
        }else{
            try {
                const {_id}=payload
                const userData=await User.findById(_id);
                if(userData){
                    req.user=userData;
                    console.log(userData)
                    next();

                }
            } catch (error) {
                console.log(error)
                return res.status(400).json({message:'Something Wrong',status:0})
            }
        }
        
    })

}

module.exports.isAdmin=async(req,res,next)=>{
    let userData=await User.find()
    console.log(userData)
}