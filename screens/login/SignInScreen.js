import React from 'react';
import { 
    View, 
    TextInput,
    Button, 
    Text, 
    AsyncStorage, 
    StyleSheet 
} from 'react-native';
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
            <Button 
                title="Log in with Spotify" 
                onPress={ () => navigate('SpotWebView') }
            /> 
            <Text>Or</Text>
            <View style={{flexDirection: "row" }}>
                <TextInput
                    placeholder="Enter your LastFM username"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "#000" }}
                    onChangeText={text => setState(text)}
                    value={value}
                />
                <Button
                    title="Go"
                    onPress={ () => setLFMuser(value) }
                />
            </View>

            <Text>Or</Text>
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
