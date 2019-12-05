import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { WebView } from 'react-native-webview';

export default SpotWebViewScreen = (props) => {

    LFMloginTrue = async (e) => {

        if (e.url.indexOf('https://www.last.fm/api/auth?token=') !== -1) {
            let token = e.url.split("token=")[1];
            try {
                await AsyncStorage.setItem('LFMauthToken', token)
                props.navigation.navigate('Main');
            } catch(e) {
                console.log(e)
            }
        }
    }

    return(
        <WebView 
            style={{width: window.width, height: window.height}}                        
            source={{ uri: 'https://spot-auth-backend.herokuapp.com/LFM_login' }}
            onNavigationStateChange={(e)=> LFMloginTrue(e)}
        />
    )
}
