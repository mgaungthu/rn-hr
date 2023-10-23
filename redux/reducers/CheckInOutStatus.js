import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  CheckIn: {status: false, time: '0:00'},
  CheckOut: {status: false, time: '0:00'},
};

export const CheckInOutStatus = createSlice({
  name: 'checkinout',
  initialState: initialState,
  reducers: {
    checkInStatus: (state, action) => {
      state.CheckIn.status = action.payload.status;
      state.CheckIn.time = action.payload.time;
    },
    checkOutStatus: (state, action) => {
      state.CheckOut.status = action.payload.status;
      state.CheckOut.time = action.payload.time;
    },
    resetcheckInOutStatus: () => {
      return initialState;
    },
  },
});

export const {checkInStatus, checkOutStatus,resetcheckInOutStatus} = CheckInOutStatus.actions;

export default CheckInOutStatus.reducer;
