import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import RootNavigation from './navigation/RootNavigation';



const App = () => {
  
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
