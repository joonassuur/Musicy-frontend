import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  AppState
} from 'react-native';
import {connect} from 'react-redux'
import { Icon, Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';

import fetchFuncs from '../FetchFunctions';
import {rand, log, secondObj} from "../methods";

let viewedTracks = []

class HomeScreen extends React.Component {

  state = {
    searchInProgress: false,
    saved: false,
    searchCount : 0
  }

  fetchRec = async (arg = {}) => {
    

    //user might not have enough listening data on spotify for this feature to do anything. Stop after 7 runs to prevent infinite loops.
    if (this.state.searchCount > 7) {
      alert('Not enough listening data on this Spotify account to use this feature')
      this.setState({searchCount: 0})
      return;
    }

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
        saved: false,
        searchCount: 0
      })

      if (arg.discoverNew) {
        //add track to "recently viewed" list, if discover mode is on, so it wont appear again for some time
        viewedTracks.length > 300 ? viewedTracks = [] : viewedTracks.push(track[1])
      }
      
      return;
    }

    log("again..")
    //If picked value is from LFM and spotify does not have the given artist, the script will keep running until the condition is true
    this.setState({searchCount: this.state.searchCount++})
    this.fetchRec(arg)
  }


  restartOnFocus = () => {
    //restarts the auth process when the app gains focus (for a new oAuth token)
    if (AppState.currentState === "active"){
      this.props.navigation.navigate('Auth');
    }
  }

  componentDidMount = async () => {
    //restart the app when it regains focus to get a new spotify auth token
    AppState.addEventListener("change", ()=> this.restartOnFocus() ); 
  }

  
  render() {
    const {searchInProgress} = this.state
    const remoteImage = this.props.nowPlaying.imageSource
    const theme = this.props.theme
    const loading = this.props.loading

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      gradient: {
        flex:1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      },
      topBtn: {
        borderRadius: 20,
        width: 150,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: theme.buttonBG,
      },
      bottomBtn: {
        borderRadius: 20,
        width: 150,
        marginBottom: 10,
        backgroundColor: theme.buttonBG
      },
      albumCover: {
        width: 250,
        height: 250
      },
    });

    return (
      <View style={styles.container}>
        <LinearGradient
          style={ styles.gradient }
          colors={theme.backgroundGrad}
          >

          { remoteImage ?
            <Image style={styles.albumCover}
                   source={{uri: remoteImage} }
            /> :
            <Icon name='ios-musical-notes'
                  type='ionicon'
                  color={theme.noteIcon}
                  size={150}
            />
          }

          <Button onPress={ ()=>{
              if (!searchInProgress && !loading)
                this.fetchRec({
                  discoverNew: true, 
                  limit: 40,
                })}}
            title="Discover"
            buttonStyle={styles.topBtn}
            titleStyle={{
              color: theme.buttonTXT,
              fontSize: 14,
            }}
            loading={searchInProgress ? true : false}
          />

          <Button onPress={ ()=>{
              if (!searchInProgress && !loading)
                this.fetchRec({
                  timeRange: rand(["short_term", "medium_term", "long_term"]),
                  limit: 40,
                })}} 
            title="Something familiar"
            buttonStyle={styles.bottomBtn}
            titleStyle={{
              color: theme.buttonTXT,
              fontSize: 14,
            }}
            loading={searchInProgress ? true : false}
          />

        </LinearGradient>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams,
    shouldLogout: state.shouldLogout,
    loading: state.loading,
    theme: state.theme
  }
}

const setNowPlaying = (track) => ({ type: 'SET_NOWPLAYING', track })
const setTheme = (theme) => ({ type: 'SET_THEME', theme })

const mapDispatchToProps = dispatch => {
  return {
    setNowPlaying: (track) => dispatch(setNowPlaying(track)),
    setTheme: (theme) => dispatch(setTheme(theme)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)



