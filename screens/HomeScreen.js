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

  fetchUserTop = async (timeRange) => {
    //get user's top artists/genres from Spotify
    if (this.state.SPYtoken !== null) {
      return await makeSPYreq({
        url: SPYfetchURL("user"), 
        type: "fetchUserTop",
        timeRange: timeRange || "medium_term"
      })  
    }
  }

  fetchRecomArt = async (discoverNew, timeRange) => {
    //get related artists based on user's Spotify top played artists
    let userTopArr = await this.fetchUserTop(timeRange),
        //grab random value from user's Spotify top played
        ranID = userTopArr[Math.floor(Math.random() * userTopArr.length)]
        //make "similar artists" requests to both Spotify and LFM based on above value. 
        //Both return one random value that is not in users current top played for given period.
        SPYrecom = await makeSPYreq({
          url: SPYfetchURL("rltdArt", ranID[1]), 
          type: "recommendArtist", 
          arr: userTopArr,
          discoverNew: discoverNew
        }),
        LFMrecom = await makeLFMreq({
          url: LFMfetchURL("rltdArt", ranID[0]), 
          type: "recommendArtist", 
          arr: userTopArr,
          discoverNew: discoverNew
        }),
        //returned values from both Spotify and LFM
        overall = [SPYrecom[0], LFMrecom],
        ranOverall = overall[Math.floor(Math.random() * overall.length)],
        //Pick randomly either Spotify or LFM recommendation and return it. 
        //If picked value is from LFM and spotify does not have the given artist, the script will run again
        final = await makeSPYreq({
          url: SPYfetchURL("search"), 
          type: "search", 
          searchTerm: ranOverall
        });

        console.log("overall:"+overall)
        console.log("ranOverall:"+ranOverall)
    return final
  }

  fetchRecomAlbum = async (discoverNew, timeRange) => {
    //get recommended albums
    if (this.state.SPYtoken !== null) {
      let id = await this.fetchRecomArt(discoverNew, timeRange),
          album = await makeSPYreq({
            url: SPYfetchURL("album", id[1]), 
            type: "recommendAlbum"
          });
      return album;
    }
  }

  fetchRec = async (arg) => {
    arg = {
      discoverNew: arg.discoverNew || true,
      timeRange: arg.timeRange || "medium_term",
      type: arg.type || "artist",
      genre: arg.genre || undefined
    }

    let result = (arg.type === "artist" ? 
                  await this.fetchRecomArt(arg.discoverNew, arg.timeRange) :
                  await this.fetchRecomAlbum(arg.discoverNew, arg.timeRange)
    )

    if ( result !== undefined && result.length > 0 ) {
      console.log("result" + result)
      return;
    } 

    console.log("again..")
    console.log("arg:")
    console.log(arg)
    this.fetchRec(arg)
    
  }

  componentDidMount = async () => {
    await this.setToken();
    //this.clearAll();
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>HomesScreen</Text>
          <Button onPress={()=>this.fetchRec({type: "artist"})} title="Recommend me an artist"/>
          <Button onPress={()=>this.fetchRec({type: "album"})} title="Recommend me an album"/>
          <Button onPress={
            ()=>this.fetchRec({
              discoverNew: false,  
              timeRange: "short_term"}
            )} 
            title="Recommend me something familiar"
          />
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
