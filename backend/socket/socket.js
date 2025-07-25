
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
export const userSocketMap = {}
export const getReceiverSocketId = (receiver) =>{
  return userSocketMap[receiver]
}
io.on("connection", (socket)=>{
  // socket.emit("hello", "hello sagar")
  const userId = socket.handshake.query.userId
  if(userId !== undefined){
    userSocketMap[userId] = socket.id
  }
  io.emit("onlineUsers", Object.keys(userSocketMap))
  socket.on("disconnect", () => {
    delete userSocketMap[userId]
      io.emit("onlineUsers", Object.keys(userSocketMap))
  });
})
export {app,server, io}
