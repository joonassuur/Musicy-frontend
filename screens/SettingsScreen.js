import React from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {connect} from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem } from 'react-native-elements'
import {lightTheme, darkTheme} from '../constants/Colors';

function SettingsScreen(props) {

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
    }    
  }

  changeTheme = async () => {
  
    theme.theme === "light" ? props.setTheme(darkTheme) : props.setTheme(lightTheme)
      
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
      borderTopColor: "white",
      borderTopWidth: 1
    },
    gradient: {
      flex:1,
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
      <View style={styles.container}>
        <LinearGradient
          style={ styles.gradient }
          colors={theme.backgroundGrad}
        >
          <View style={styles.listContainer}>
            <ListItem
              containerStyle={styles.listItem}
              title={"Log Out"}
              subtitle={"Tap to log out"}
              titleStyle={{ fontSize: 13, color: "#fff", fontWeight: "bold" }}
              subtitleStyle={{ fontSize: 12, color: "#fff" }}
              onPress={this.logOut}
            />
            <ListItem
              containerStyle={styles.listItem}
              title={"Theme"}
              subtitle={"Change the theme of the app"}
              titleStyle={{ fontSize: 13, color: "#fff", fontWeight: "bold" }}
              subtitleStyle={{ fontSize: 12, color: "#fff" }}
              onPress={this.changeTheme}
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
  title: 'app.json',
};




