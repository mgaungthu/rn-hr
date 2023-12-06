import React, {useEffect, useState} from 'react';
import { Linking, Platform, Alert } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import VersionCheck from 'react-native-version-check';

import store, { persistor } from './redux/store';
import RootNavigation from './navigation/RootNavigation';
import { SelectContextProvider } from './screens/RequestTabPage/SelectContext';
import BubbleAnimation from './components/BubbleAnimation';





const App = () => {

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: 'com.ananda.attendance', // Replace with your app's package name
          ignoreErrors: true,
        });

        const currentVersion = VersionCheck.getCurrentVersion();

        if (latestVersion > currentVersion) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  
                    VersionCheck.needUpdate()
                    .then(async res => {
                      // console.log(res.isNeeded);    // true
                      if (res.isNeeded) {
                        // console.log(res.storeUrl)
                        Linking.openURL(res.storeUrl);  // open store if update is needed.
                      }
                    })
                },
              },
            ],
            { cancelable: false }
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
