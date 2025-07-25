import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { LuSearch } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutBoxLine } from "react-icons/ri";
import { serverUrl } from "../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  setOtherUsers,
  setSearchUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
function Sidebar() {
  let { userData, selectedUser, onlineUsers, searchUsers } = useSelector(
    (state) => state.user,
  );
  let [search, setSearch] = useState(false);
  let [input, setInput] = useState('');
  let { otherUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        },
      );
      dispatch(setSearchUsers(result.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);
  return (
    <div
      className={`lg:w-[30%] w-full h-full lg:block ${
        !selectedUser ? "block" : "hidden"
      } bg-slate-200`}
    >
      <div
        className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-orange-800 text-gray-100 shadow-gray-400 fixed bottom-[20px] "
        onClick={handleLogout}
      >
        <RiLogoutBoxLine className="w-[25px] h-[25px]" />
      </div>
      <div className="w-full h-[250px] bg-orange-600 rounded-b-[22%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px] ">
        <h1 className="text-white font-bold text-[25px]">WhatsAppChat</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-700 font-semibold text-[30px]">
            hii , {userData.name || "user"}
          </h1>
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400">
            <img
              src={userData.image || dp}
              className="h-[100%] w-[100%]"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-[20px]">
          {!search && (
            <div
              className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-400 "
              onClick={() => setSearch((prev) => !prev)}
            >
              <LuSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[50px] bg-white shadow-gray-400 shadow-lg flex items-center gap-[10px] overflow-hidden rounded-full px-[20px] mt-[20px]">
              <LuSearch className="w-[25px] h-[25px]" />
              <input
                type="text"
                placeholder="search users..."
                className="w-full h-full p-[10px] outline-0 border-0 text-[17px]"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="cursor-pointer h-[25px] w-[25px]"
                onClick={() => {
                  setSearch((prev) => !prev);
                   dispatch(setSearchUsers(null));
                }}
              />
            </form>
          )}
          {!search &&
            otherUsers?.map(
              (user, id) =>
                onlineUsers?.slice(0, 3)?.includes(user?._id) && (
                  <div className="relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px] cursor-pointer">
                    <div
                      className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center"
                      key={user._id || id}
                      onClick={() => dispatch(setSelectedUser(user))}
                    >
                      <img src={user.image || dp} className="" />
                    </div>
                    <span className="w-[12px] h-[12px] rounded-full absolute bg-green-600 bottom-2 right-0"></span>
                  </div>
                ),
            )}
        </div>
      </div>
      <div className="w-full  h-[60vh] mt-[20px] overflow-auto flex flex-col gap-[20px] items-center">
        {(searchUsers?.length > 0 ? searchUsers : otherUsers)?.map(
          (user, id) => (
            <div
              className="w-[95%] h-[60px] flex justify-start items-center gap-[20px] shadow-gray-400 shadow-lg bg-white rounded-full hover:bg-orange-300 cursor-pointer relative"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div
                className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center  shadow-gray-300 shadow-lg bg-white "
                key={user._id || id}
              >
                <img src={user.image || dp} className="" />
                {onlineUsers?.includes(user?._id) && (
                  <span className="w-[12px] h-[12px] rounded-full absolute bg-green-600 left-[53px] top-8"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[20px]">
                {user.name || user.userName}
              </h1>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default Sidebar;
