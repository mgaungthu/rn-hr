import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unapprovedCount: 0,
  status: 'idle',
  error: null,
};

const leaveList = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLeaveRequests: (state, action) => {
      state.unapprovedCount = action.payload.filter((request) => request.statusby_manager === 0).length;
    },
    addleaveRequest: (state, action) => {
      if (action.payload.statusby_manager === 0) {
        state.unapprovedCount += 1;
      }
    },
    approveleaveRequest: (state, action) => {
      const requestId = action.payload;
      const request = state.requests.find((request) => request.id === requestId);
      if (request) {
        request.statusby_manager = 1;
        state.unapprovedCount -= 1;
      }
    },
    resetLeaveApprove:()=> {
      return initialState
    }
  },
});

export const { setLeaveRequests, addleaveRequest, approveleaveRequest ,resetLeaveApprove} = leaveList.actions;

export default leaveList.reducer;
