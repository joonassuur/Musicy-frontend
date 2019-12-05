import React from 'react'
import { View, Text, Button, AsyncStorage } from 'react-native'

class UserInputScreen extends React.Component {


    getData = async () => {
        const value = await AsyncStorage.getItem('authSkipSPYToken')
    }

    IDProcessComplete = async () => {
        await AsyncStorage.setItem('IDcomplete', "true")
        this.props.navigation.navigate('Main')
    }

    componentDidMount() {
        this.getData();
    }
    

    render() {
        return (
            <View>
                <Text
                    title="User input"
                >
                    User Input Screen
                </Text>
                <Button
                    title="complete ID input"
                    onPress={ this.IDProcessComplete }
                />
            </View>
        )
    }

    

}

export default UserInputScreen;
