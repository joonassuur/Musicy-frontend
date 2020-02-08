import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBar  } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PlayListScreen from '../screens/PlayListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {connect} from 'react-redux';

import {theme} from '../screens/login/SpotWebViewScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const TabBarComponent = props => <BottomTabBar {...props} />;

connect(mapStateToProps)(TabBarComponent)

const MainStack = createBottomTabNavigator(
  {
    Home: {
      screen: (props) => <HomeScreen {...props} />,
      navigationOptions: {
        tabBarLabel: 'Discover',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-musical-note' : 'md-musical-note' } />
          ),
        }
    },
    PlayList: {
      screen: (props) => <PlayListScreen {...props} />,
      navigationOptions: {
        tabBarLabel: 'Playlist Generator',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-flash' : 'md-flash'} />
        ),
      }
    },
    Settings: {
      screen: (props) => <SettingsScreen {...props} />,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
        ),
      }
    }, 
  },
  {
    tabBarComponent: props => {
      return (
        <TabBarComponent {...props} 
          style={{ backgroundColor: theme.navbarBG }} 
          activeTintColor={ theme.activeTintColor }
          inactiveTintColor={ theme.inactiveTintColor }
        />
      )
    },
  }
);


MainStack.path = '';


const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams,
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

