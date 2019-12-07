import { AppLoading } from 'expo';
//import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';


const initialState = {
  midTermGenrePref: [],
  longTermGenrePref: [],
  midTermArtistPref: [],
  longTermArtistPref: [],
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_MID_TERM_GENRE_PREF':
      return {midTermGenrePref : state.midTermGenrePref}
    case 'SET_LONG_TERM_GENRE_PREF':
      return {longTermGenrePref: state.longTermGenrePref}
    case 'SET_MID_TERM_ARTIST_PREF':
      return {midTermArtistPref : state.midTermArtistPref}
    case 'SET_LONG_TERM_ARTIST_PREF':
      return {longTermArtistPref: state.longTermArtistPref}
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
    backgroundColor: '#fff',
  },
});
