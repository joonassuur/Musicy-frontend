import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PlayListScreen from '../screens/PlayListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AudioPlayer from '../components/AudioPlayer';
import {connect} from 'react-redux';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const MainStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Discover',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={
                Platform.OS === 'ios'
                  ? `ios-musical-note${focused ? '' : '-outline'}`
                  : 'md-musical-note'
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
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-flash' : 'md-flash'} />
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
  },
  {
    tabBarOptions: { 
      style: {
        backgroundColor: '#669999'
       },
      activeTintColor: '#F2C94C',
      inactiveTintColor: '#fff',
    },
  });


MainStack.path = '';


const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams
  }
}


export default connect(mapStateToProps)(MainStack)


const styles = StyleSheet.create({

  player: {
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    width: "100%",
    backgroundColor: "#800000"
  }

});

