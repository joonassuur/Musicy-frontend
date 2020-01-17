import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem, Icon, Button } from 'react-native-elements'

export default function SettingsScreen(props) {

  var RCTNetworking = require("RCTNetworking");


  logOut = async () => {
    //clear async storage, cookies and navigate to signin page
    try {
      await AsyncStorage.clear()
      RCTNetworking.clearCookies(() => {});
      props.navigation.navigate('Auth');
    } catch(e) {
      // clear error
    }   
    
  }

  return (
      <View style={styles.container}>
        <LinearGradient
          style={ styles.gradient }
          colors={['#F2994A', '#F2C94C']}
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
          </View>
        </LinearGradient>
      </View>
    );
}

SettingsScreen.navigationOptions = {
  title: 'app.json',
};


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
    backgroundColor: "#66999980", 
  },
  gradient: {
    flex:1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

