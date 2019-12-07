import React from 'react';
import {
  Image,
  Platform,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
} from 'react-native';
import {makeSPYreq} from '../apis/spotify';

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

  fetchUserTop = async () => {
    //get user's top artists/genres
    return await makeSPYreq(URL().SPY.user.topArtists, this.state.SPYtoken, "fetchUserTop", "medium_term")    
  }

  fetchRecomArt = async () => {
    //get related artists
    let id = await this.fetchUserTop()
    let artist = await makeSPYreq(URL(id).SPY.artist.relatedArt, this.state.SPYtoken, "recommendArtist")
    return artist
  }

  fetchRecomAlbum = async () => {
    //get recommended albums
    let id = await this.fetchRecomArt()
    let album = await makeSPYreq(URL(id[1]).SPY.artist.albums, this.state.SPYtoken, "recommendAlbum")
    return album;
  }

  displayRecommendation = async (type) => {
    if (type === "artist") {
      console.log(await this.fetchRecomArt())
    }
    if (type === "album") {
      console.log(await this.fetchRecomAlbum())
    }
  }

  componentDidMount = async () => {
    await this.setToken();
    //this.clearAll();
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>HomesScreen</Text>
          <Button onPress={()=>this.displayRecommendation("artist")} title="Recommend me an artist"></Button>
          <Button onPress={()=>this.displayRecommendation("album")} title="Recommend me an album"></Button>
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
