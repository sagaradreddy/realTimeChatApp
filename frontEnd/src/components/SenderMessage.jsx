import React from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dp.webp'
function SenderMessage({image, message}) {
 let {userData} = useSelector(state=>state.user)
  return (
    <div className='flex gap-3'>
    <div className='w-fit max-w-[500px] px-[10px] py-[3px] mb-2 bg-blue-300 text-white text-[18px] rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-400 font-semibold shadow-lg flex flex-col gap-[20px]'>
      {image && <img src={image} alt="" className='w-[150px] rounded-lg'/>}
      {message && <span>{message}</span> }
    </div>
    <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400">
          <img src={userData.image || dp}  className="h-[100%] w-[100%]"/>
        </div>
    </div>
  )
}

export default SenderMessage
