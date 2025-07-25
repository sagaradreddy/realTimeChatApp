import pathCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import {io} from "../socket/socket.js"
export const sendMessage = async(req,res)=>{
  try {
    let sender = req.userId
    let {receiver} = req.params
    console.log("receiver", receiver);
    let {message} = req.body
    console.log("req.body", message)
    console.log("req.file", req.file)
    let image;
    if(req.file){
      image = await pathCloudinary(req.file.path)
        console.log('Image Uploaded:', image);
    }
    let conversation = await Conversation.findOne({
      participants:{$all:[sender,receiver]}
    })
    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image
    })
    if(!conversation){
      conversation = await Conversation.create({
        participants:[sender, receiver],
        messages:[newMessage._id]
      })
    }else{
      conversation.messages.push(newMessage._id)
      await conversation.save()
    }
    const receiverSocketId = getReceiverSocketId(receiver)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
      console.log("Socket Message Sent:", newMessage);
    }
    return res.status(201).json(newMessage)
  } catch (error) {
      console.error("sendMessage error:", error);
    return res.status(400).json({msg:'send message error',error})
  }
}

export const getMessage = async(req,res)=>{
  try {
    let sender=req.userId
    let {receiver} = req.params
    let conversation = await Conversation.findOne({
      participants:{$all:[sender,receiver]}
    }).populate("messages")
    if(!conversation){
      return res.status(200).json([])
    }
    return res.status(200).json(conversation?.messages)
  } catch (error) {
    
  }
}