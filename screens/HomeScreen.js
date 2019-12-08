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
import {makeLFMreq} from '../apis/lastfm';
import {SPYfetchURL, LFMfetchURL} from '../apis/URL';
export default class HomeScreen extends React.Component {

  state = {
    SPYtoken: null,
    LFMuser: null,
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
    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken'),
          LFMuser = await AsyncStorage.getItem('LFMuser'),
          skipToken = await AsyncStorage.getItem('authSkipSPYToken');

    this.setState({
      SPYtoken: SPYauthToken,
      LFMuser: LFMuser,
      authSkipSPYToken: skipToken
    })
  }

  fetchUserTop = async () => {
    //get user's top artists/genres
    if (this.state.SPYtoken !== null) {
      return await makeSPYreq(SPYfetchURL("user"), this.state.SPYtoken, "fetchUserTop", "medium_term")  
    }
  }

  fetchRecomArt = async () => {
    //get related artists
    if (this.state.SPYtoken !== null) {
      let id = await this.fetchUserTop(),
          SPYrecom = await makeSPYreq(SPYfetchURL("relatedArt", id[1]), this.state.SPYtoken, "recommendArtist"),
          LFMrecom = await makeLFMreq(LFMfetchURL("relatedArt", id[0]), "recommendArtist"),
          overall = [SPYrecom[0], LFMrecom],
          ranOverall = overall[Math.floor(Math.random() * overall.length)];
      console.log("overall:"+overall)
      let final = await makeSPYreq(SPYfetchURL("search"), this.state.SPYtoken, "search", undefined, ranOverall);
      return final
    }
  }

  fetchRecomAlbum = async () => {
    //get recommended albums
    if (this.state.SPYtoken !== null) {
      let id = await this.fetchRecomArt(),
          album = await makeSPYreq(SPYfetchURL("album", id[1]), this.state.SPYtoken, "recommendAlbum");
      return album;
    }
  }

  displayRecommendation = async (type) => {
    if (type === "artist") {
      let result = await this.fetchRecomArt()

      if (result !== undefined && result.length>0) {
        console.log(result)
        return;
      } else {
        console.log("again")
        this.displayRecommendation("artist")
      }
      
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
