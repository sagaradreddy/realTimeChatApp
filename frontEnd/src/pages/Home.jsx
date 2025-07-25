import React from 'react'
import Sidebar from '../components/Sidebar'
import Message from '../components/Message'
import { useSelector } from 'react-redux'
import useGetMessages from '../customHook/useGetMessages'

function Home() {
  const {selectedUser} = useSelector(state=>state.user)
  console.log(selectedUser)
  useGetMessages()
  return (
    <div className='w-full h-screen flex overflow-hidden  bg-slate-200'>
      <Sidebar/>
      <Message/>
    </div>
  )
}

export default Home
