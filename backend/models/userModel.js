const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        
    },
    followers:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
})

const User=mongoose.model('User',userSchema);

module.exports=User;