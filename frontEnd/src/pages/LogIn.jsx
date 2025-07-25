import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main';
import { useDispatch } from 'react-redux';
import { setSelectedUser, setUserData } from '../redux/userSlice';

function LogIn() {
   let navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('')
  let [err, setErr] = useState(false)
  let [loader, setLoader] = useState(false)
  let dispatch = useDispatch()
  let handleLogin = async (e) =>{
    e.preventDefault()
    setLoader(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logIn`,{
      email, password
    },{
      withCredentials:true
    })
    dispatch(setUserData(result.data))
    dispatch(setSelectedUser(null))
    navigate('/')
    setEmail('')
    setPassword('')
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.msg)
    } finally{
      setLoader(false)
    }
    
  }
  return (
    <div className='w-full h-[100vh] bg-slate-500 flex items-center justify-center'>
     <div className="w-full max-w-[450px] h-[550px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
      <div className="w-full h-[200px] bg-orange-400 rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
        <h1 className='text-gray-600 font-bold text-[30px]'>LogIn to <span className='text-white'>WhatsAppChat</span></h1>
      </div>
      <form className='w-full bg-white flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
        <input type="email" placeholder='email'className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg' onChange={(e)=>setEmail(e.target.value)} value={email} />
        <div className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg relative'>
      <input type={show ? 'text' :'password'} placeholder='password' className='w-full h-full outline-none' onChange={(e)=>setPassword(e.target.value)} value={password} />
      <span className='absolute top-[10px] right-[10px] text-orange-400 font-bold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show? "hidden": "show"}`}</span>
        </div>
      {err && <p className='text-red-600'>{'*' +err}</p>}

        <button className='px-[20px] py-[10px] bg-orange-400 rounded-2xl shadow-gray-200 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner cursor-pointer' type='submit' disabled={loader}>{loader ? 'Logging in...' : 'Log In'}</button>
        <p className='cursor-pointer' onClick={()=>navigate('/signup')}>Want to create a new account ? <span className='text-orange-400'>SignUp</span></p>
      </form>
     </div>
    </div>
  )
}

export default LogIn
