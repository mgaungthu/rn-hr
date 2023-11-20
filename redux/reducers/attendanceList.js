import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unapprovedCount: 0,
  status: 'idle',
  error: null,
};

const attendanceList = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceRequests: (state, action) => {
      // state.requests = action.payload;
      state.unapprovedCount = action.payload.filter((request) => request.statusby_manager === 0).length;
    },
    addAttendanceRequest: (state, action) => {
      if (action.payload.statusby_manager === 0) {
        state.unapprovedCount += 1;
      }
    },
    approveAttendanceRequest: (state, action) => {
      const requestId = action.payload;
      const request = state.requests.find((request) => request.id === requestId);
      if (request) {
        request.statusby_manager = 1;
        state.unapprovedCount -= 1;
      }
    },
    resetApprove:()=> {
      return initialState
    }
  },
});

export const { setAttendanceRequests, addAttendanceRequest, approveAttendanceRequest ,resetApprove} = attendanceList.actions;

export default attendanceList.reducer;
