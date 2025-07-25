import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/authRouter.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
import userRouter from "./routes/user.route.js"
import messageRouter from "./routes/message.route.js"
dotenv.config()
import { app, server } from "./socket/socket.js"

const port = process.env.PORT || 8000

// const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials:true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)

server.listen(port, ()=>{
connectDb()
  console.log('server is started ')
})