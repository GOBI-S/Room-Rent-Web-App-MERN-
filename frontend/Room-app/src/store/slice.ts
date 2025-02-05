import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  email: string;
  Userid: string;
}

const initialState: UserState = {
  name: "",
  email: "", // Initial state will be populated from persisted storage
  Userid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.Userid = action.payload.Userid;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.Userid = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
