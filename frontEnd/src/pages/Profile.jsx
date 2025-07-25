import React, { useState, useRef } from 'react'
import dp from '../assets/dp.webp'
import { CiCamera } from "react-icons/ci"; 
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
function Profile() {
  let {userData} = useSelector(state=>state.user)
  console.log(userData, 'userData')
  let navigate = useNavigate()
  let [name, setName] = useState(userData.name || "")
  let [frontimage, setFrontimage] = useState(userData.image || dp)
  let [backendImage, setBackendImage] = useState(null)
  let [saving,setSaving] = useState(false)
  let image = useRef()
  let dispatch = useDispatch()
  let handleImage = (e)=>{
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontimage(URL.createObjectURL(file))
  }
  let handleProfile = async(e)=>{
     setSaving(true)
     e.preventDefault()
       try {
          let formData = new FormData()
      formData.append("name",name)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result = await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
      dispatch(setUserData(result.data))
      navigate('/')
       setSaving(false)
    } catch (error) {
      console.log(error)
      setSaving(false)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-slate-300 flex flex-col justify-center items-center'>
      <div className="absolute top-2 left-2 ">
    <IoArrowBackSharp className='h-[30px] w-[30px] cursor-pointer' onClick={()=>navigate('/')} />
      </div>
      <div className=' bg-white rounded-full border-4 border-orange-500  shadow-gray-400 shadow-lg cursor-pointer   relative' onClick={()=>image.current.click()}>
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center">
          <img src={frontimage}  className="h-[100%] w-[100%]"/>
        </div>
        <div className=" absolute bottom-4 text-gray-600 right-5 w-[35px] h-[35px] rounded-full bg-orange-500 flex justify-center items-center">
        <CiCamera className='cursor-pointer text-gray-700 shadow-gray-400'/>
        </div>
        
      </div>
      <form onSubmit={handleProfile} className='mt-8 w-[95%] h-[230px] max-w-[500px] flex flex-col gap-[20px] items-center justify-center'>
    <input type="file" accept='image/*' hidden ref={image} onChange={handleImage} />
    <input type="text" placeholder='Enter your Name' className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg' onChange={(e)=>setName(e.target.value)} value={name}/>
    <input type="text" placeholder='' className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg' value={userData?.userName} readOnly />
    <input type="email" placeholder='' className='w-[90%] h-[50px] outline-none border-2 border-orange-300 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-300 shadow-lg' value={userData?.email} readOnly />
    <button className='px-[20px] py-[10px] bg-orange-400 rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner cursor-pointer' disabled={saving} >{saving?'Saving...':'save profile'} </button>
      </form>
    </div>
  )
}

export default Profile