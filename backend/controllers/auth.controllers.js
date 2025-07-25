import bcrypt from 'bcryptjs'
import genToken from "../config/token.js"
import User from "../models/user.model.js"

export const signUp = async (req,res)=>{
  try {
    const {userName, email, password} = req.body
    const checkUserName = await User.findOne({userName})
    if(checkUserName){
      res.status(400).json({msg:'user already exist'})
    }
    const checkUserEmail =  await User.findOne({email})
    if (checkUserEmail) {
      res.status(400).json({msg:'user email already exist '})
    }
    if(password.length <6){
      res.status(400).json({msg:'password length more then 6 characters'})
    }
    const hashPassword = await bcrypt.hash(password,10);
    const user = await User.create({
      userName,email, password:hashPassword
    })
    const token = await genToken(user._id)

    res.cookie('token',token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
      sameSite:'none',
      secure: true
    })
    res.status(201).json({msg:'user created successfully',user})

  } catch (error) {
    console.log('signup error', error)
    return res.status(500).json({msg:'server error'})
  }
}

export const logIn = async (req,res)=>{
  try {
    const {email, password} = req.body
    const user =  await User.findOne({email})
    if (!user) {
     return res.status(400).json({msg:'user not found '})
    }
    const isMatch =  await  bcrypt.compare(password,user.password)
    if(!isMatch){
     return res.status(400).json({mag:'password not matching '})
    }
     const token = await genToken(user._id)
    res.cookie('token',token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
      sameSite:'none',
      secure: true
    })
    return res.status(200).json(user)

  } catch (error) {
    console.log('signin error')
    return res.status(500).json({msg:'login error'})
  }
}

export const logOut =  async(req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({msg:'logout successfully'})
  } catch (error) {
    res.json({msg:'something error',error})
  }
}
