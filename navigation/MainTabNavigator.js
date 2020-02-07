import React from 'react';
import { Platform, StyleSheet, AsyncStorage } from 'react-native';
import { createBottomTabNavigator, BottomTabBar  } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PlayListScreen from '../screens/PlayListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {connect} from 'react-redux';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


let theme;

const getActiveTheme = async () => {
  const activeTheme = await AsyncStorage.getItem('theme')
  return activeTheme
}

getActiveTheme()

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
      checkTheme = async () => theme = await getActiveTheme();
      checkTheme()
      return (
        <TabBarComponent {...props} 
          style={{ backgroundColor: theme === "dark" ? "#0d0d0d" : '#669999' }} 
          activeTintColor={theme === "dark" ? "#cc0000" : '#F2C94C'}
          inactiveTintColor={theme === "dark" ? "#fff" : '#fff'}
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
    theme: state.theme
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

