import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';


export default createAppContainer(
  createSwitchNavigator({
    Auth: AuthStack,
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
));
