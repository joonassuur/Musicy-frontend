import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const {navigate} = this.props.navigation;

        const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');
        const LFMuser = await AsyncStorage.getItem('LFMauthToken')
        const skipToken = await AsyncStorage.getItem('authSkipSPYToken');
        const IDcomplete = await AsyncStorage.getItem('IDcomplete');

        if (LFMuser || (skipToken && IDcomplete) ) {
          return navigate('Main')
        }
        if (SPYauthToken) {
          return navigate('SpotWebView')
        }
        if (skipToken && !IDcomplete) {
          return navigate('UserInput')
        } 
        else {
          return navigate('SignIn')
        }

    };
  
    // Render any loading content that you like here
    render() {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
}

export default AuthLoadingScreen;
