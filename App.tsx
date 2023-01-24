/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Spacer} from 'native-base';
import {SplashScreen} from './src/screens';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <Text>This shit works!!</Text>
      {/* <SplashScreen /> */}
    </SafeAreaView>
  );
}

export default App;
