import React from 'react';
import { createStackNavigator, HeaderBackButton } from 'react-navigation';

import SignInScreen from '../screens/login/SignInScreen';
import SpotWebViewScreen from '../screens/login/SpotWebViewScreen';
import AuthLoadingScreen from '../screens/login/AuthLoadingScreen';
import UserInputScreen from '../screens/login/UserInputScreen';

export default AuthStack = createStackNavigator(
    { 
        AuthLoading: AuthLoadingScreen,
        SpotWebView: SpotWebViewScreen,
        SignIn: SignInScreen,
        UserInput:  {
            screen: UserInputScreen,
            navigationOptions: ({ navigation }) => {
                return {
                  headerLeft: ( <HeaderBackButton onPress={ () => navigation.navigate("SignIn") } /> )
                }
            }
        }
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

