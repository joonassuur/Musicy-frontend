import React from 'react';
import { ActivityIndicator, AsyncStorage, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import makeReq from '../../apis/request';
import {SPYfetchURL} from '../../apis/URL';

export default SpotWebViewScreen = (props) => {

    const [loading, setLoading] = React.useState(true)

    SPYloginTrue = async (e) => {

        //handle loading screen
        if ( !e.url.includes('https://spot-auth-backend.herokuapp.com/') && 
             !e.url.includes('https://accounts.spotify.com/authorize?') ) 
            setLoading(false)

        if (e.url.indexOf('https://spot-auth-backend.herokuapp.com/auth_success?') !== -1) {
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
        <View style={ {flex: 1} } >

            { loading &&
                <View style={styles.spinner}>
                    <ActivityIndicator size='large' color="#fff" />
                </View>
            }

            <WebView 
                style={ {width: window.width, height: window.height} }                        
                source={ { uri: 'https://spot-auth-backend.herokuapp.com/login' } }
                onNavigationStateChange={ (e)=> SPYloginTrue(e) }
            />
            
        </View>
    )
}


const styles = StyleSheet.create({

    spinner: {
      flex: 100,
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex:  10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F2994A",
      width: "100%",
      height: "100%"
    },

  
});
  
