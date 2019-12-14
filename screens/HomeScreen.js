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
import AudioPlayer from '../components/AudioPlayer';

import {makeSPYreq} from '../apis/spotify';
import {makeLFMreq} from '../apis/lastfm';
import {SPYfetchURL, LFMfetchURL} from '../apis/URL';
import {rand, log, last, secondObj} from "../methods";


export default class HomeScreen extends React.Component {

  state = {
    SPYtoken: null,
    LFMuser: null,
    authSkipSPYToken: null,

    nowPlaying: {
        title: null,
        artist: null,
        uri: null,
        imageSource: "https://semantic-ui.com/images/wireframe/square-image.png"
    }
  }

  clearAll = async () => {
    //clear async storage
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }    
    log("cleared")
  }

  
  setToken = async () => {
    //function currently not in use in this screen
    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken'),
          LFMuser = await AsyncStorage.getItem('LFMuser'),
          skipToken = await AsyncStorage.getItem('authSkipSPYToken');

    this.setState({
      SPYtoken: SPYauthToken,
      LFMuser: LFMuser,
      authSkipSPYToken: skipToken
    })
  }

  fetchUserTop = async (timeRange, limit) => {
    //get user's top artists/genres from Spotify
    return await makeSPYreq({
      url: SPYfetchURL("user"), 
      type: "fetchUserTop",
      timeRange: timeRange,
      limit: limit
    })
  }

  fetchRecomArt = async (discoverNew, timeRange, limit) => {
    //get related artists based on user's Spotify top played artists
    let userTopArr = await this.fetchUserTop(timeRange, limit),
        //grab random value from user's Spotify top played. [0] == name, [1] == ID
        ranUserTop = rand(userTopArr),
        final = undefined; //final value to be returned in case the randomly picked artist is from LFM

        if (discoverNew) {
        //if bool "discoverNew" is true, make "similar artists" requests to both Spotify and LFM based on above value. Both return one random value that is not in users current top played (inside userTopArr value) for given period.
          let SPYrecom = await makeSPYreq({ //Spotify Recommendation
            url: SPYfetchURL("rltdArt", ranUserTop[1]), 
            type: "recommendArtist", 
            arr: userTopArr,
            discoverNew: discoverNew
          })
          let LFMrecom = await makeLFMreq({ //LFM Recommendation
            url: LFMfetchURL("rltdArt", ranUserTop[0]), 
            type: "recommendArtist", 
            arr: userTopArr,
            discoverNew: discoverNew
          })
          //Pick randomly either Spotify or LFM recommendation and return it.
          let ranOverall = rand([SPYrecom[0], LFMrecom]);
          ranOverall === SPYrecom[0] ? 
          // if the picked ranOverall value is from Spotify, exit here...
          final = SPYrecom[1] :
          // ...else search the LFM recommendation on Spotify
          final = await makeSPYreq({
            url: SPYfetchURL("search"), 
            type: "search", 
            searchTerm: ranOverall
          });
          return final
        }
        //if bool "discoverNew" is false, pick an artist already in user's top played for the selected period
        return ranUserTop[1]
  }

  fetchRecomAlbum = async (discoverNew, timeRange) => {
    //first fetch an artist ID, then make an album request based on said ID
    //not in use currently
    let id = await this.fetchRecomArt(discoverNew, timeRange),
        album = await makeSPYreq({
          url: SPYfetchURL("album", id), 
          type: "recommendAlbum"
        });
    return album;
  }

  fetchTopTracks = async (discoverNew, timeRange, limit) => {
    //first fetch an artist ID, then make a track request based on said ID
    let id = await this.fetchRecomArt(discoverNew, timeRange, limit),
        track = await makeSPYreq({
          url: SPYfetchURL("track", id), 
          type: "topTracks"
        });
        
        if (track) {
          //assign correct image to track object
          track[4] = secondObj(track[4]).url  
        }

    return track;
  }

  fetchRec = async (arg = {}) => {

    // halt new search requests while "searchInProgress" is true
    this.setState({searchInProgress: true})
    
    arg = {
      //discoverNew = only pick among recommended artists that are not in user's top played list
      discoverNew: arg.discoverNew,
      timeRange: arg.timeRange || "medium_term",
      limit: arg.limit || 20,
      genre: arg.genre || undefined,  //not in use currently
    }

    let track = await this.fetchTopTracks(arg.discoverNew, arg.timeRange, arg.limit);

    if ( track && track.length > 0 ) {
      this.setState({
        searchInProgress: false,
        nowPlaying: { 
          uri: track[3],
          title: track[0],
          artist: track[2].map( e => e ).join(', '),
          imageSource: track[4] || "https://semantic-ui.com/images/wireframe/square-image.png"
        }
      })
      return;
    } 

    log("again..")
    //If picked value is from LFM and spotify does not have the given artist, the script will keep running until the condition is true
    this.fetchRec(arg)
  }

  componentDidMount = async () => {
    await this.setToken();
    //this.clearAll();    
  }
  
  render() {
    const {searchInProgress} = this.state
    return (
      <View style={styles.container}>

          <Text>HomeScreen</Text>
          <Image style={styles.albumCover}
                 source={{ uri: this.state.nowPlaying.imageSource }}
          />
          <AudioPlayer
            nowPlaying={this.state.nowPlaying}
          />
          <Button onPress={ ()=>{
              if (!searchInProgress)
                this.fetchRec({
                  discoverNew: true, 
                  limit: 40,
                })}}
            title="Discover"
          />

          <Button onPress={ ()=>{
              if (!searchInProgress)
                this.fetchRec({
                  timeRange: rand(["short_term", "medium_term", "long_term"]),
                  limit: 40,
                })}} 
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
  albumCover: {
    width: 250,
    height: 250
  },

});
