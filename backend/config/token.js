import jwt from "jsonwebtoken"
const genToken = async (userId)=>{
  try {
    const token = await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"1d"} )
    return token
  } catch (error) {
    console.log('error')
    res.json({msg:'token expired'})
  }
}
export default genToken