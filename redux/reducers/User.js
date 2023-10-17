import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

export const User = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginUserInfo: (state, action) => {
      return {
        ...state,
        ...{isLoggedIn: true},
        ...action.payload
      };
    },
    resetUser: () => {
      return initialState;
    },
  },
  
});


export const {loginUserInfo, resetUser} = User.actions;

export default User.reducer;
