import React, { useState, useEffect  } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';
import AudioPlayer from '../components/AudioPlayer';
import {connect} from 'react-redux';

const RootNav = createSwitchNavigator({
  Auth: AuthStack,
  Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
)

const AppContainer = createAppContainer(RootNav);

function CombinedComponents(props) {

  const [authFinished, setAuthFinished] = useState(false);
  const theme = props.theme;

  function getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }  


  const styles = StyleSheet.create({

    player: {
      paddingTop: 40,
      paddingBottom: 20,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
      width: "100%",
      backgroundColor: theme.playerBG
    }
  
  });

  return(
    <View style={{ flex: 1 }}>
      { authFinished &&
          <View style={styles.player}>
            { props.nowPlaying.uri ?
              <AudioPlayer shouldLogout={props.shouldLogout} /> : 
              <Text style={{color:theme.text}}>Please select a song to preview</Text> }
          </View>
      }
      <AppContainer
        onNavigationStateChange={(prevState, currentState) => {
          const currentRouteName = getActiveRouteName(currentState);
          if (currentRouteName === "Home" || currentRouteName === "PlayList" )
            setAuthFinished(true)

          if (currentRouteName === "SignIn")
            setAuthFinished(false)
        }}
      />
    </View>
  )
}

const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams,
    shouldLogout: state.shouldLogout,
    theme: state.theme
  }
}

export default connect(mapStateToProps)(CombinedComponents)



