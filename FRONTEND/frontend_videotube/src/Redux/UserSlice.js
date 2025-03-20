import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Stores user data (null if not logged in)
    isLoggedIn: false, // Tracks login status
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            console.log(action.payload)
            state.isLoggedIn = true;
            console.log(state.user)
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
