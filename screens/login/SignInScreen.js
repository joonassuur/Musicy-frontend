import React from 'react';
import { View, Button, Text, AsyncStorage, StyleSheet } from 'react-native';
import axios from 'axios';

const SignInScreen = ( props ) => {

    const {navigate} = props.navigation

    SPYloginSkip = async () => {
        axios.get('https://spot-auth-backend.herokuapp.com/login_skip')
        .then( async (res) => {
            //do something with auth code
           // console.log(res.data)
            await AsyncStorage.setItem('authSkipToken', res.data)
            navigate('UserInput')
        })
        .catch(e => console.log(e));
    }

    return (
        <View style={styles.container}>
            <Button 
                title="Log in with Spotify" 
                onPress={ () => navigate('SpotWebView') }
            /> 
            <Text
                onPress={ ()=> SPYloginSkip() }
            >
                skip login 
            </Text>
            <Text>(data will be lost if app is removed)</Text>
        </View>
    )
}

export default SignInScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});

SignInScreen.navigationOptions = {
    header: null,
};
