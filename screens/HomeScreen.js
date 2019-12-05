import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
} from 'react-native';
import {spotify} from '../apis/spotify';

import URL from '../apis/URL';
export default class HomeScreen extends React.Component {

  state = {
    SPYtoken: null,
    LFMtoken: null,
    authSkipSPYToken: null,
  }

  clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }    
    console.log("cleared")
  }

  setToken = async () => {
    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');
    const LFMauthToken = await AsyncStorage.getItem('LFMauthToken');
    const skipToken = await AsyncStorage.getItem('authSkipSPYToken');

    this.setState({
      SPYtoken: SPYauthToken,
      LFMtoken: LFMauthToken,
      authSkipSPYToken: skipToken
    })
  }


  componentDidMount = async () => {
    await this.setToken();
    makeSPYreq(URL.SPY.user.topArtists, this.state.SPYtoken, "userTop")
    
  //  this.clearAll();
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>HomesScreen</Text>
      </View>
    );
  }

}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
