// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  email: string;
  role:string;
}

const initialState: UserState = {
  name: "",
  email: "",
  role:"",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role=action.payload.role;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.role="";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
