import { AppLoading } from 'expo';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import {lightTheme, darkTheme} from './constants/Colors';


const initialState = {
  nowPlaying: { 
    title: null,
    id: null,
    artist: null,
    uri: null,          
    imageSource: null,
    key: null
  },
  playbackInstance: null,
  shouldLogout: false,
  loading: false,
  theme: lightTheme
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_NOWPLAYING':
      return {...state, nowPlaying : action.track}
    case 'SET_PLAYBACK_INSTANCE':
      return {...state, playbackInstance: action.instance.playbackInstance}
    case 'SET_LOGOUT':
      return {...state, shouldLogout: action.x}
    case 'SET_LOADING':
      return {...state, loading: action.x}
    case 'SET_THEME':
      return {...state, theme: action.theme}
    case 'RESET_STATE':
      return initialState
    default:
      return state;
  }
}

const store = createStore(reducer)

export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = useState(false);
  
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }

}

async function loadResourcesAsync() {
  await Promise.all([
/*      Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar      
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),  */
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2994A"
  },
});
