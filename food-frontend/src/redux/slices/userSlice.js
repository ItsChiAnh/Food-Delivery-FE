import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null, // Lấy thông tin người dùng từ localStorage
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload; // Cập nhật thông tin người dùng
    },
    logout: (state) => {
      state.userInfo = null; // Xóa thông tin người dùng
      localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
      localStorage.removeItem("userInfo"); // Xóa thông tin người dùng khỏi localStorage
      console.log(
        "User logged out and data cleared from Redux and localStorage"
      );
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
