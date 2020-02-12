import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/login/SignInScreen';
import SpotWebViewScreen from '../screens/login/SpotWebViewScreen';
import AuthLoadingScreen from '../screens/login/AuthLoadingScreen';

export default AuthStack = createStackNavigator(
    { 
        AuthLoading: {
            screen: AuthLoadingScreen,
            navigationOptions: {
                header: null,
              }
        }, 
        SignIn: {
            screen: SignInScreen,
            navigationOptions: {
                header: null,
              }
        },
        SpotWebView: {
            screen: SpotWebViewScreen,
            navigationOptions: {
                header: null,
              }
        }
    },
    {
        headerMode: 'screen',
        initialRouteName: 'AuthLoading',
    }
);

AuthStack.path = '';
