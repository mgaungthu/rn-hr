import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import User from './reducers/User';
import CheckInOutStatus from './reducers/CheckInOutStatus';

const rootReducer = combineReducers({
  user: User,
  checkinout: CheckInOutStatus,
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
