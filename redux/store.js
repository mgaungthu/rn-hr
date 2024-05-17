import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import User from './reducers/User';
import CheckInOutStatus from './reducers/CheckInOutStatus';
import attendanceList from './reducers/attendanceList';
import leaveList from './reducers/leaveList';
import overTimeList from './reducers/overTimeList';

const rootReducer = combineReducers({
  user: User,
  checkinout: CheckInOutStatus,
  attendance: attendanceList,
  leave: leaveList,
  overtime: overTimeList,
});

const configuration = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
};

const persistedReducer = persistReducer(configuration, rootReducer);

// const store = configureStore({
//   reducer: {
//     user: rootReducer,
//   },
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    });
  },
});

export default store;
export const persistor = persistStore(store);
