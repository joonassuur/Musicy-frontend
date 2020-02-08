import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import makeReq from '../apis/request';
import {SPYfetchURL} from '../apis/URL';
import {connect} from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem, Icon } from 'react-native-elements'
import {lightTheme, darkTheme} from '../constants/Colors';

//TODO: add: "logged in as:" in a list

function SettingsScreen(props) {

  const [username, setUsername] = useState('')
  var RCTNetworking = require("RCTNetworking");

  const theme = props.theme

  logOut = async () => {
    //clear async storage, cookies and navigate to signin page
    try {
      //send logout command to AudiPlayer component, so it will unload the song before it clears redux state
      props.setLogout(true)
      await AsyncStorage.clear()
      RCTNetworking.clearCookies(() => {});
      props.navigation.navigate('Auth'); 
    } catch(e) {
      // clear error
      console.log(e)
    }
  }

  changeTheme = async () => {

    const activeTheme = await AsyncStorage.getItem('theme')
    activeTheme === "light" ? await AsyncStorage.setItem('theme', 'dark') : await AsyncStorage.setItem('theme', 'light')
    theme.theme === "light" ? props.setTheme(darkTheme) : props.setTheme(lightTheme)

    props.navigation.navigate('Auth'); 
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    listContainer: {
      flex: 4,
      width:"100%",
    },
    listItem: {
      backgroundColor: theme.listItem, 
      borderTopColor: theme.listItemBorder,
      borderTopWidth: 2
    },
    gradient: {
      flex:1,
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  
  const fetchUserProfile = async () => {
    let ID = await makeReq({
      url: SPYfetchURL("profile"),
      type: "profile"
    });
    setUsername(ID)
  }

  useEffect( () => {
      //fetch user profile
      fetchUserProfile()
  }, []);
  
  return (
      <View style={styles.container}>
        <LinearGradient
          style={ styles.gradient }
          colors={theme.backgroundGrad}
        >
          <View style={styles.listContainer}>
            <ListItem
              containerStyle={styles.listItem}
              title={`Logged in as: ${username}`}
              subtitle={"Tap to log out"}
              titleStyle={{ fontSize: 13, color: theme.text, fontWeight: "bold" }}
              subtitleStyle={{ fontSize: 12, color: theme.text }}
              onPress={this.logOut}
            />
            <ListItem
              containerStyle={styles.listItem}
              title={"Theme"}
              subtitle={"Change the theme of the app"}
              titleStyle={{ fontSize: 13, color: theme.text, fontWeight: "bold" }}
              subtitleStyle={{ fontSize: 12, color: theme.text }}
              onPress={this.changeTheme}
              rightElement=
              {
                theme.theme === "dark" ? 
                  <Icon
                    name='ios-bulb'
                    type='ionicon'
                    color="#fff"
                  /> : 
                  <Icon
                    name='ios-bulb'
                    type='ionicon'
                    color="#ff0"
                  />
              }
            />
          </View>
        </LinearGradient>
      </View>
    );
}


const mapStateToProps = state => {
  return {
    shouldLogout: state.shouldLogout,
    theme: state.theme
  }
}

const setLogout = (x) => ({ type: 'SET_LOGOUT', x })
const setTheme = (theme) => ({ type: 'SET_THEME', theme })

const mapDispatchToProps = dispatch => {
  return {
    setLogout: (x) => dispatch(setLogout(x)),
    setTheme: (theme) => dispatch(setTheme(theme)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)


SettingsScreen.navigationOptions = {
  title: 'Settings',
};




