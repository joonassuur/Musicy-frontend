import * as React from 'react';
import { ActivityIndicator, AsyncStorage, View } from 'react-native';
import { WebView } from 'react-native-webview';

import makeReq from '../../apis/request';
import {SPYfetchURL} from '../../apis/URL';

export default SpotWebViewScreen = (props) => {

    const [display, setDisplay] = React.useState("flex")
    const [loading, setLoading] = React.useState(false)

    SPYloginTrue = async (e) => {

        if (e.url.indexOf('https://spot-auth-backend.herokuapp.com/auth_success?') !== -1) {
            setDisplay("none")
            setLoading(true)
            let token = e.url.split("access_token=")[1];
            let ID = await makeReq({
                url: SPYfetchURL("profile"),
                type: "profile"
            });
            try {
                await AsyncStorage.setItem('SPYauthToken', token)
                await AsyncStorage.setItem('spotifyID', ID)
                props.navigation.navigate('Main');
            } catch(e) {
                console.log(e)
            }
        }

    }

    return(
        <View style={ {height:"100%" , width:"100%"} } >
            { loading &&
                <View>
                    <ActivityIndicator size='large' />
                </View>
            }
            <WebView 
                style={ {width: window.width, height: window.height, display: display} }                        
                source={ { uri: 'https://spot-auth-backend.herokuapp.com/login' } }
                onNavigationStateChange={ (e)=> SPYloginTrue(e) }
            />
        </View>
    )
}
