/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import notifee from '@notifee/react-native';
import {name as appName} from './app.json';

notifee.onBackgroundEvent(async () => {});
AppRegistry.registerComponent(appName, () => App);
