import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { WebView } from 'react-native-webview';

export default SpotWebViewScreen = (props) => {

    SPYloginTrue = async (e) => {

        if (e.url.indexOf('https://spot-auth-backend.herokuapp.com/auth_success?') !== -1) {
            let token = e.url.split("access_token=")[1];
            try {
                await AsyncStorage.setItem('SPYauthToken', token)
                props.navigation.navigate('Main');
            } catch(e) {
                console.log(e)
            }
        }
    }

    return(
        <WebView 
            style={{width: window.width, height: window.height}}                        
            source={{ uri: 'https://spot-auth-backend.herokuapp.com/login' }}
            onNavigationStateChange={(e)=> SPYloginTrue(e)}
        />
    )
}
