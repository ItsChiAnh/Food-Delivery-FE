import { createSlice } from "@reduxjs/toolkit";

// Trạng thái ban đầu
const initialState = {
  userInfo: null, // Lưu thông tin người dùng
};

// Tạo slice
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
    },
  },
});

export const { setUser, logout } = userSlice.actions; // Xuất các action
export default userSlice.reducer; // Xuất reducer

