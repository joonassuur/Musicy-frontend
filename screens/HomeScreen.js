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
import {connect} from 'react-redux'
import { Icon, Button } from 'react-native-elements'

import AudioPlayer from '../components/AudioPlayer';
import fetchFuncs from '../FetchFunctions';
import {rand, log, last, secondObj} from "../methods";

let viewedTracks = []

class HomeScreen extends React.Component {

  state = {
    SPYtoken: null,
    LFMuser: null,
    authSkipSPYToken: null,
    searchInProgress: false,
    saved: false
  }

  clearAll = async () => {
    //clear async storage
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }    
    log("cleared async storage")
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

  saveTrack = () => {
    if (this.props.nowPlaying.id !== null) {
      fetchFuncs()

      //display heart icon, indicating that the track can either be liked or removed from likes
      return(
        <View>
          { !this.state.saved &&
            <Icon
              name='ios-heart-empty'
              type='ionicon'
              color='#000'
              onPress={ async () => {
                  //add track to user's favorites
                  let res = await saveTrack("save", this.props.nowPlaying.id)
                  if (res === 200) {
                    this.setState({saved: true});
                  }
                }
              }
            />
          }

          { this.state.saved &&
            <Icon
              name='ios-heart'
              type='ionicon'
              color='#000'
              onPress={ async () => {
                  //remove track to user's favorites
                  let res = await saveTrack("remove", this.props.nowPlaying.id)
                  if (res === 200) {
                    this.setState({saved: false});
                  }
                }
              }
            />
          }
        </View>

      )
    }
  }

  fetchRec = async (arg = {}) => {
    
    fetchFuncs()
    // halt new search requests while "searchInProgress" is true
    this.setState({searchInProgress: true})
    
    arg = {
      //discoverNew = only pick among recommended artists that are not in user's top played list
      discoverNew: arg.discoverNew, // bool. defaults to falsy
      timeRange: arg.timeRange || "medium_term",
      limit: arg.limit || 40,
      genre: arg.genre || undefined,  //not in use currently
    }

    // track [0] = title,  [1] = id, [2] = artist, [3] = uri, [4] = image
    let track = await fetchRecommendedTracks(arg.discoverNew, arg.timeRange, arg.limit);

    if (track && track.length > 0) {

      //assign correct image to track object
      track[4] = secondObj(track[4]).url  
      //checks if track is already in recently viewed list
      if (viewedTracks.includes(track[1])) {
        track = undefined;
      }

      this.props.setNowPlaying({        
          title: track[0],
          id: track[1],
          artist: track[2].map(e=>e).join(', '),
          uri: track[3],          
          imageSource: track[4],
      })

      this.setState({
        searchInProgress: false,
        saved: false
      })

      if (arg.discoverNew) {
        //add track to "recently viewed" list, if discover mode is on, so it wont appear again for some time
        viewedTracks.length > 300 ? viewedTracks = [] : viewedTracks.push(track[1])
      }
      
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

          <Image style={styles.albumCover}
                 source={{ uri: this.props.nowPlaying.imageSource || "https://semantic-ui.com/images/wireframe/square-image.png" }}
          />

          
          <Button onPress={ ()=>{
              if (!searchInProgress)
                this.fetchRec({
                  discoverNew: true, 
                  limit: 40,
                })}}
            title="Discover"
            buttonStyle={styles.topBtn}
            titleStyle={{
              color: "white",
              fontSize: 14,
            }}
            loading={searchInProgress ? true : false}
          />

          <Button onPress={ ()=>{
              if (!searchInProgress)
                this.fetchRec({
                  timeRange: rand(["short_term", "medium_term", "long_term"]),
                  limit: 40,
                })}} 
            title="Something familiar"
            buttonStyle={styles.bottomBtn}
            titleStyle={{
              color: "white",
              fontSize: 14,
            }}
            loading={searchInProgress ? true : false}
          />

          { this.saveTrack() }

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams
  }
}

const setNowPlaying = (track) => ({ type: 'SET_NOWPLAYING', track })

const mapDispatchToProps = dispatch => {
  return {
    setNowPlaying: (track) => dispatch(setNowPlaying(track))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
  },
  topBtn: {
    borderRadius: 20,
    width: 150,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#153737"
  },
  bottomBtn: {
    borderRadius: 20,
    width: 150,
    marginBottom: 10,
    backgroundColor: "#153737"
  },
  albumCover: {
    width: 250,
    height: 250
  },

});
