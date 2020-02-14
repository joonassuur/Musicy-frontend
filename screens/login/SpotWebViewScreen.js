import React from 'react';
import { ActivityIndicator, AsyncStorage, View, StyleSheet, BackHandler  } from 'react-native';
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux'
import makeReq from '../../apis/request';
import {SPYfetchURL} from '../../apis/URL';
import {lightTheme, darkTheme} from '../../constants/Colors';

export let theme;
export let ID;

const SpotWebViewScreen = (props) => {

    const [loading, setLoading] = React.useState(true)


    BackHandler.addEventListener('hardwareBackPress', function() {
        // hardware back button
        // allows going back if wrong authentication method is chosen
        props.navigation.navigate('Auth');
    });

    SPYloginTrue = async (e) => {

        //handle loading screen
        if ( !e.url.includes('https://spot-auth-backend.herokuapp.com/') && 
             !e.url.includes('https://accounts.spotify.com/authorize?') ) 
            setLoading(false)

        if (e.url.indexOf('https://spot-auth-backend.herokuapp.com/auth_success?') !== -1) {
            
            setLoading(true)

            //set user's specified theme on app load
            const activeTheme = await AsyncStorage.getItem('theme')
            
            if (!activeTheme)
                await AsyncStorage.setItem('theme', 'light')

            activeTheme === "dark" ? props.setTheme(darkTheme) : props.setTheme(lightTheme)
            theme = props.theme

            //set access token
            let token = e.url.split("access_token=")[1];
            await AsyncStorage.setItem('SPYauthToken', token)

            //fetch user profile
            ID = await makeReq({
                url: SPYfetchURL("profile"),
                type: "profile"
            });

            //navigate to homescreen
            try {
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
  

const mapStateToProps = state => {
    return {
      theme: state.theme
    }
}  

const setTheme = (theme) => ({ type: 'SET_THEME', theme })

const mapDispatchToProps = dispatch => {
  return {
    setTheme: (theme) => dispatch(setTheme(theme)),
  }
}

  
export default connect(mapStateToProps, mapDispatchToProps)(SpotWebViewScreen)
  
  
  
