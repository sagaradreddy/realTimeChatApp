import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
// import { setUserData } from '../redux/userSlice'
import { setMessage } from '../redux/messageSlice'

function useGetMessages() {
  let dispatch = useDispatch()
  let {selectedUser} = useSelector(state=>state.user)
  useEffect(()=>{
    const fetchMessage = async()=>{
      try {
        let result = await axios.get(`${serverUrl}/api/message/send/${selectedUser?._id}`,{withCredentials:true})
        dispatch(setMessage(result.data))
      } catch (error) {
        console.log(error)
      }
      
    }
    fetchMessage()
  },[dispatch, selectedUser])
}

export default useGetMessages
