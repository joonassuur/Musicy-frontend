import { createSwitchNavigator } from 'react-navigation';

import SignInScreen from '../screens/login/SignInScreen';
import SpotWebViewScreen from '../screens/login/SpotWebViewScreen';
import LFMWebViewScreen from '../screens/login/LFMWebViewScreen';
import AuthLoadingScreen from '../screens/login/AuthLoadingScreen';

export default AuthStack = createSwitchNavigator(
    { 
        AuthLoading: AuthLoadingScreen,
        SpotWebView: SpotWebViewScreen,
        LFMWebView: LFMWebViewScreen,
        SignIn: SignInScreen,
    },
    {
        initialRouteName: 'AuthLoading',
    },
    
);

AuthStack.path = '';
