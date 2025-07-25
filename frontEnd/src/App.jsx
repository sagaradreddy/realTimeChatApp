/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import useCurrentUser from './customHook/useCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import useGetOthers from './customHook/useGetOthers'
import {io} from 'socket.io-client'
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  useCurrentUser()
  useGetOthers()
  let {userData, socket, onlineUsers} = useSelector(state=>state.user)
  let dispatch = useDispatch()
  console.log(userData?._id)
  console.log(socket)
  console.log(onlineUsers)

  useEffect(()=>{
    if(userData){
          const socketio = io(`${serverUrl}`,{
       withCredentials: true,
       query:{
        userId:userData?._id
       }
    })
    dispatch(setSocket(socketio))
    socketio.on("onlineUsers",(users)=>{
     dispatch(setOnlineUsers(users))
    })

    return ()=>{
      socketio.close()
      
    }
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }

  },[dispatch, userData])
  return (
    <Routes>
      <Route path='/login' element={!userData?<LogIn/>:<Navigate to="/"/>} />
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>} />
      <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup" />}/>
    </Routes>
  )
}

export default App
