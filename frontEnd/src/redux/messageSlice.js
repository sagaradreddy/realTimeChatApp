import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    message: [],
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});
export const { setMessage} =
  messageSlice.actions;

export default messageSlice.reducer;
