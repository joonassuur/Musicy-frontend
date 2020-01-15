import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PlayListScreen from '../screens/PlayListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AudioPlayer from '../components/AudioPlayer';
import {connect} from 'react-redux'
const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const MainStack = createBottomTabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Discover',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={
                Platform.OS === 'ios'
                  ? `ios-information-circle${focused ? '' : '-outline'}`
                  : 'md-information-circle'
              }
            />
          ),
        }
    },
    PlayList: {
      screen: PlayListScreen,
      navigationOptions: {
        tabBarLabel: 'Playlist Generator',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
        ),
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
        ),
      }
    },
});


MainStack.path = '';


const AppContainer = createAppContainer(MainStack);

function Music(props) {

  return(
    <View style={{ flex: 1 }}>
      <View style={styles.player}>
        { props.nowPlaying.uri ?
          <AudioPlayer
            style={ { backgroundColor: "#000" } }
          /> : <Text style={{color:"#fff"}}>Please select a song to preview</Text> }
      </View>
      <AppContainer />
    </View>
  )
}

const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams
  }
}


export default connect(mapStateToProps)(Music)


const styles = StyleSheet.create({

  player: {
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    width: "100%",
    backgroundColor: "#000"
  }

});

