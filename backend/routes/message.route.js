import express from 'express'
import isAuth from '../middleware/isAuth.js';
import { upload } from '../middleware/multer.js';
import { getMessage, sendMessage } from '../controllers/message.controllers.js';

const messageRouter = express.Router()

messageRouter.post('/send/:receiver',isAuth, upload.single("image"), sendMessage)
messageRouter.get('/send/:receiver', isAuth, getMessage)



export default messageRouter