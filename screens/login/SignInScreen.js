import React from 'react';
import { 
    View, 
    AsyncStorage, 
    StyleSheet 
} from 'react-native';
import { Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const SignInScreen = ( props ) => {

    const {navigate} = props.navigation
    const [value, setState] = React.useState('');

    SPYloginSkip = async () => {
        axios.get('https://spot-auth-backend.herokuapp.com/login_skip')
        .then( async (res) => {
            //do something with auth code
           // console.log(res.data)
            await AsyncStorage.setItem('authSkipSPYToken', res.data)
            navigate('UserInput')
        })
        .catch(e => console.log(e));
    }

    setLFMuser = async (user) => {
        await AsyncStorage.setItem('LFMuser', user)
        navigate('Main')
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                style={ styles.gradient }
                colors={['#F2994A', '#F2C94C']}>
                <Button 
                    buttonStyle={styles.button}
                    title="Log in with Spotify" 
                    onPress={ () => navigate('SpotWebView') }
                /> 
            </LinearGradient>
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
    gradient: {
        flex:1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#669999"
    },
});

SignInScreen.navigationOptions = {
    header: null,
};
