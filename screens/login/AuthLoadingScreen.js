import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {

    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const {navigate} = this.props.navigation;

        const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');
/*         const LFMuser = await AsyncStorage.getItem('LFMauthToken')
        const skipToken = await AsyncStorage.getItem('authSkipSPYToken');
        const IDcomplete = await AsyncStorage.getItem('IDcomplete'); */

        if (SPYauthToken) {
          return navigate('SpotWebView')
        }

        else {
          return navigate('SignIn')
        }

    };
  
    render() {
      return (
          <View style={{flex: 100, justifyContent: "center", alignItems: "center",}}>
            <ActivityIndicator size='large' />
          </View>
      );
    }
}

export default AuthLoadingScreen;
