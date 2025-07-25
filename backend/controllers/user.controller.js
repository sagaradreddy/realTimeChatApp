import pathCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async(req,res)=>{
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password")
    
  if(!user){
    return res.status(400).json({msg:'user not found'})
  }
  return res.json(user)

  } catch (error) {
    return res.status(400).json({msg:'user not getting'})
  }
}

export const editProfile= async(req,res)=>{
  try {
    let {name} = req.body
    let image;
    if(req.file){
      image = await pathCloudinary(req.file.path)
    }
    let user = await User.findByIdAndUpdate(req.userId,{
      name,
      image
    },{new:true})
    if(!user){
      return res.status(400).json({msg:"user not found"})
    }
    return res.status(200).json(user)
  } catch (error) {
    
  }
}

export const getOtherControllers = async(req,res)=>{
  try {
    let users = await User.find({
      _id:{$ne:req.userId}
    }).select('-password')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({msg:"get other users" , error})
  }
}

export const search = async(req,res)=>{
  try {
    let {query} = req.query
    if(!query){
      return res.status(400).json({message:"query is required"})
    }
    let users = await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {userName:{$regex:query,$options:"i"}}
      ]
    })
    console.log(users)
    return res.status(200).json(users)
  } catch (error) {
    
  }
}