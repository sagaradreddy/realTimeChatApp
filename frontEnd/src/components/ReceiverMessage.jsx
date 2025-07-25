import React from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
function ReceiverMessage({ image, message }) {
  let { selectedUser } = useSelector((state) => state.user);
  console.log(selectedUser);
  return (
    <div className="flex gap-2 ">
      <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400">
        <img src={selectedUser.image || dp} className="h-[100%] w-[100%]" />
      </div>
      <div className="w-fit max-w-[500px] px-[20px] py-[5px] mb-2 bg-blue-300 text-white text-[18px] rounded-tr-none rounded-2xl relative left-0  shadow-gray-400 font-semibold shadow-lg flex flex-col gap-[10px]">
        {image && <img src={image} alt="" className="w-[150px] rounded-lg" />}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default ReceiverMessage;
