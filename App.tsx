/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'jotai';
import { MainNavigator, MyTabs } from './src/navigation/Main';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(): JSX.Element {
  return (
    <Provider>
      <SafeAreaProvider>
        <MyTabs />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
