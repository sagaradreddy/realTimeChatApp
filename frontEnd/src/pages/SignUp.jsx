import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  let navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [userName, setUserName] = useState()
  let [userEmail, setUserEmail] = useState()
  let [userPassword, setUserPassword] = useState()
  let [loader, setLoader] = useState(false)
  let dispatch = useDispatch()
    let handleSignUp = async(e)=>{
      e.preventDefault()
      setLoader(true)
    try {
      let signUpResult = await axios.post(`${serverUrl}/api/auth/create`,{
        userName,
        email:userEmail,
        password:userPassword
      },{
        withCredentials:true
      })
      dispatch(setUserData(signUpResult.data))
      navigate('/')
      setUserEmail('')
      setUserName('')
      setUserPassword('')
    } catch (error) {
      console.log(error.response.data)
    } finally{
      setLoader(false)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-slate-500 flex items-center justify-center'>
     <div className="w-full max-w-[450px] h-[550px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
      <div className="w-full h-[200px] bg-orange-400 rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
        <h1 className='text-gray-600 font-bold text-[30px]'>welcome to <span className='text-white'>WhatsAppChat</span></h1>
      </div>
      <form onSubmit={handleSignUp} className='w-full bg-white flex flex-col gap-[20px] items-center'>
        <input type="text" placeholder='username'
         className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg'
         onChange = {(e)=>setUserName(e.target.value)}
         value = {userName}
          />
        <input type="email" placeholder='email'className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg'
        onChange = {(e)=> setUserEmail(e.target.value)} value={userEmail} />
        <div className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg relative'>
        <input type={show ? 'text' :'password'} placeholder='password' className='w-full h-full outline-none'
        onChange ={(e)=>setUserPassword(e.target.value)} value={userPassword} />
        <span className='absolute top-[10px] right-[10px] text-orange-400 font-bold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{show? "hidden": "show"}</span>
        </div>
      

        <button className='px-[20px] py-[10px] bg-orange-400 rounded-2xl shadow-gray-200 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner cursor-pointer' type='submit'
        disabled={loader}> {loader ? 'Signing up...' : 'Sign Up'}</button>
        <p className='cursor-pointer' onClick={()=>navigate('/login')}>Already have an account ? <span className='text-orange-400'>Login</span></p>
      </form>
     </div>
    </div>
  )
}

export default SignUp
