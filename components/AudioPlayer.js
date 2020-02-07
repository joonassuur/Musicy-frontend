import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    View,
    StyleSheet,
    Text
} from 'react-native';
import { Icon } from 'react-native-elements'
import {Audio} from 'expo-av';
import {connect} from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import fetchFuncs from '../FetchFunctions';
import {log} from "../methods"

class AudioPlayer extends React.Component {

    state = {
        isPlaying: false,
        volume: 1.0,
        isBuffering: false,
        saved: false,
        justFinished: false
    }

    handlePlayPause = async () => {

        const { isPlaying } = this.state
        const { playbackInstance, nowPlaying } = this.props

        if (nowPlaying.uri) {
            
            isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        
            this.setState({
                isPlaying: !isPlaying
            })
        } 
    }

    loadAudio = async () => {
        const {isPlaying, volume, justFinished} = this.state

        this.props.setLoading(true)

        try {
            const playbackInstance = new Audio.Sound()
            const source = {
                uri: this.props.nowPlaying.uri
            }
        
            const status = {
                shouldPlay: isPlaying,
                volume
            }
    
            playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)    
            await playbackInstance.loadAsync(source, status, false)

            this.props.setPlaybackInstance({playbackInstance})
            this.props.setLoading(false)

            if (justFinished) {
              this.setState({justFinished: false})
              return;
            }

            if (!isPlaying){
                this.handlePlayPause()
            }

        } catch (e) {
            console.log(e)
        }
    }
   
    onPlaybackStatusUpdate = async status => {
        const { playbackInstance } = this.props

        this.setState({
            isBuffering: status.isBuffering
        })

        //reload song and stop playback once it reaches the end
        if ( status.didJustFinish ) {
            this.setState({justFinished: true}, async () => {
              this.handlePlayPause();
              await playbackInstance.unloadAsync()
              this.loadAudio()
            })

        } 
    }

    async componentDidUpdate(prevProps, prevState) {
        const { playbackInstance, nowPlaying } = this.props

        //get the logout command from SettingsScreen component and unload song, then reset redux state
        if (this.props.shouldLogout) {
            await playbackInstance.unloadAsync()
            this.props.resetState()
            return;
        }

        if (nowPlaying !== prevProps.nowPlaying) {
            this.setState({saved: false})
            if(playbackInstance) 
                await playbackInstance.unloadAsync()

            if (nowPlaying.uri) {
                this.loadAudio()
            }
        }
    }

    async componentDidMount() {

        this.props.setLogout(false)

        try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: false,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: false,
            staysActiveInBackground: false,
            playThroughEarpieceAndroid: false
        })
        } catch (e) {
            console.log(e)
        }

        this.loadAudio()
    }


    renderFileInfo() {
        const { nowPlaying } = this.props
        const theme = this.props.theme

        return (
            <View style={styles.trackInfo}>
                <Text style={[styles.trackInfoText, styles.largeText, {color: theme.text}]}>
                    {nowPlaying.title}
                </Text>
                <Text style={[styles.trackInfoText, styles.smallText, {color: theme.text}]}>
                    {nowPlaying.artist}
                </Text>
            </View>
        )
    }

    saveTrack = () => {

      const theme = this.props.theme

        if (this.props.nowPlaying.id !== null) {

          fetchFuncs()
    
          //display heart icon, indicating that the track can either be liked or removed from likes
          return(
            <View style={styles.heart}>
              { !this.state.saved &&
                <Icon
                  name='ios-heart-empty'
                  type='ionicon'
                  color={theme.heart}
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
                  color={theme.heart}
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

    render() {

      const { playbackInstance, loading } = this.props
      const theme = this.props.theme

      return(
        <View>
          {
            playbackInstance ?
              <View style={styles.container}>
                <TouchableOpacity onPress={this.handlePlayPause}>
                    {this.state.isPlaying ? (
                    <Ionicons name='ios-pause' size={48} color={theme.playPause} />
                    ) : (
                    <Ionicons name='ios-play-circle' size={48} color={theme.playPause} />
                    )}
                </TouchableOpacity>

                { this.renderFileInfo() }

                { this.saveTrack() }
              </View> : 
            loading ? 
              <ActivityIndicator size='large' color="#fff"/> : 
            undefined
          }
        </View>
      )
    }
}

const mapStateToProps = state => {
    return {
        nowPlaying: state.nowPlaying,
        playbackInstance: state.playbackInstance,
        shouldLogout: state.shouldLogout,
        loading: state.loading,
        theme: state.theme
    }
}

const setPlaybackInstance = (instance) => ({ type: 'SET_PLAYBACK_INSTANCE', instance })
const setLogout = (x) => ({ type: 'SET_LOGOUT', x })
const resetState = () => ({ type: 'RESET_STATE' })
const setLoading = (x) => ({ type: 'SET_LOADING', x })

const mapDispatchToProps = dispatch => {
  return {
    setPlaybackInstance: (instance) => dispatch(setPlaybackInstance(instance)),
    setLogout: (x) => dispatch(setLogout(x)),
    resetState: () => dispatch(resetState()),
    setLoading: (x) => dispatch(setLoading(x))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer)


const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    trackInfo: {
        marginTop: 10,
        marginBottom: 10
    },
    trackInfoText: {
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    largeText: {
      fontWeight: "bold",
      fontSize: 12
    },
    smallText: {
      fontSize: 10
    },

  })
