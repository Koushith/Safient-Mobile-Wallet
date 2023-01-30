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
import {Box, HStack, Heading} from 'native-base';

import {SplashScreen} from './src/screens';

const SplashScreen = () => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <HStack space={2} justifyContent="center">
        <Heading fontSize="md">Stackup</Heading>
      </HStack>
    </Box>
  );
};

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <Text>This shit works!!</Text>
      {/* <SplashScreen /> */}
    </SafeAreaView>
  );
}

export default App;
