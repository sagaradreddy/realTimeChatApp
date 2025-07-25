import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../main'
import { setOtherUsers} from '../redux/userSlice'

function useGetOthers() {
    let dispatch = useDispatch()
  useEffect(()=>{
    const fetchUser = async()=>{
      try {
        let result = await axios.get(`${serverUrl}/api/user/otherUsers`,{withCredentials:true})
        dispatch(setOtherUsers(result.data))
      } catch (error) {
        console.log(error)
      }
      
    }
    fetchUser()
  },[dispatch])
}

export default useGetOthers
