import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import RootNavigation from './navigation/RootNavigation';
import { SelectContextProvider } from './screens/RequestTabPage/SelectContext';
import BubbleAnimation from './components/BubbleAnimation';




const App = () => {


  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <SelectContextProvider>
      <NavigationContainer>
      <BubbleAnimation>
        <RootNavigation/>
      </BubbleAnimation>
      </NavigationContainer>
      </SelectContextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
