import React, {useEffect, useState} from 'react';
import {Linking, Platform, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {checkVersion} from 'react-native-check-version';

import store, {persistor} from './redux/store';
import RootNavigation from './navigation/RootNavigation';
import {SelectContextProvider} from './screens/ApproveTab/SelectContext';
import {SelectContextProvider as Context} from './screens/RequestTabPage/SelectContext';
import BubbleAnimation from './components/BubbleAnimation';

const App = () => {
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const version = await checkVersion();

        // console.log('Got version info:', version);

        if (version.needsUpdate) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.openURL(res.storeUrl);
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          // App is up-to-date, proceed with the app
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SelectContextProvider>
          <Context>
            <NavigationContainer>
              <BubbleAnimation>
                <RootNavigation />
              </BubbleAnimation>
            </NavigationContainer>
          </Context>
        </SelectContextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
