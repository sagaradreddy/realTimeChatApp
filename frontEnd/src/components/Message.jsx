import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { serverUrl } from "../main";
import axios from "axios";
import { setMessage } from "../redux/messageSlice";

function Message() {
  const { userData, selectedUser, socket } = useSelector((state) => state.user);
  const { message } = useSelector((state) => state.messages || []);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [_, setBackImage] = useState(null);
  const image = useRef();
  const bottomRef = useRef(null); // ✅ For auto-scroll

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!input) return null
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (image.current.files[0]) {
        formData.append("image", image.current.files[0]);
      }

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser?._id}`,
        formData,
        { withCredentials: true }
      );
      const displayMessage = [...message, result.data]
      dispatch(setMessage(displayMessage));
      setInput("");
      setFrontImage(null);
      setBackImage(null);
      image.current.value = "";
    } catch (error) {
      console.error(error?.response?.data || error);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackImage(file);
    setFrontImage(URL.createObjectURL(file));
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (me) => {
      dispatch(setMessage([...message, me]));
    });
    return () => socket.off("newMessage");
  }, [dispatch, message, socket]);

  // ✅ Scroll to bottom on message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`lg:w-[70%] w-full h-fit top-[50px] bg-slate-200 border-l-2 border-gray-300 ${
        selectedUser ? "block" : "hidden"
      } lg:block relative`}
    >
      {/* Header */}
      {selectedUser && (
        <div className="w-full h-[100px] bg-orange-400 rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px]">
          <div
            className="cursor-pointer"
            onClick={() => dispatch(setSelectedUser(null))}
          >
            <IoArrowBackSharp className="w-[30px] h-[30px] text-white" />
          </div>
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400">
            <img src={selectedUser?.image} className="h-full w-full" alt="user" />
          </div>
          <h1 className="text-white font-semibold text-[20px]">
            {selectedUser?.name || "user"}
          </h1>
        </div>
      )}

      {/* Empty state */}
      {!selectedUser && (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <h1 className="text-gray-700 font-bold text-[50px]">
            Welcome to WhatSappChat
          </h1>
          <p className="text-gray-700 font-semibold text-[30px]">Chat friendly!</p>
        </div>
      )}

      {/* Chat body and input */}
      {selectedUser && (
        <div className="flex-1 flex flex-col h-[calc(100vh-100px)]">
          {/* Chat messages */}
          <div className="flex-1 flex flex-col px-[20px] py-[20px] overflow-y-auto h-[90vh]">
            {showPicker && (
              <div className="absolute bottom-[120px] left-[20px] z-10">
                <EmojiPicker width={250} height={350} onEmojiClick={onEmojiClick} />
              </div>
            )}
            {message?.map((mess) =>
              mess.sender === userData._id ? (
                <SenderMessage key={mess._id} image={mess.image} message={mess.message} />
              ) : (
                <ReceiverMessage key={mess._id} image={mess.image} message={mess.message} />
              )
            )}

            {/* Bottom scroll target */}
            <div ref={bottomRef} />
          </div>

          {/* Input section */}
          <div className="w-full px-[20px] py-[10px]">
            {frontImage && (
              <img
                src={frontImage}
                alt="preview"
                className="w-[80px] h-[40px ] mb-[10px] rounded-lg shadow-gray-300"
              />
            )}
            <form
              onSubmit={handleSendMessage}
              className="w-full h-[60px] bg-orange-300 flex items-center gap-[20px] px-[20px] rounded-full relative"
            >
              <div onClick={() => setShowPicker((prev) => !prev)}>
                <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />
              <input
                type="text"
                className="w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <div
                className="w-[25px] h-[25px] text-white cursor-pointer"
                onClick={() => image.current.click()}
              >
                <IoImagesOutline />
              </div>
              <button type="submit" className="w-[25px] h-[25px] text-white cursor-pointer">
                <VscSend />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
