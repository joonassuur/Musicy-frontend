import React from 'react';
import {
    Image,
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
import {omitLast, log} from "../methods"

class AudioPlayer extends React.Component {

    state = {
        isPlaying: false,
        playbackInstance: null,
        volume: 1.0,
        isBuffering: false,
        saved: false
    }

    handlePlayPause = async () => {

        const { isPlaying, playbackInstance } = this.state

        if (this.props.nowPlaying.uri) {
            
            isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        
            this.setState({
                isPlaying: !isPlaying
            })
        } 
    }

    loadAudio = async () => {
        const {isPlaying, volume} = this.state

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
            this.setState({saved: false})
            this.setState({playbackInstance})

        } catch (e) {
            console.log(e)
        }
    }
   
    onPlaybackStatusUpdate = async status => {
        const { playbackInstance } = this.state

        this.setState({
            isBuffering: status.isBuffering
        })

        //reload song and stop playback once it reaches the end
        if ( status.didJustFinish ) {
            this.handlePlayPause() 
            await playbackInstance.unloadAsync()
            this.loadAudio()
        } 
    }

    async componentDidUpdate(prevProps, prevState) {
        const { playbackInstance } = this.state

        if (this.props.nowPlaying !== prevProps.nowPlaying) {
            if(playbackInstance) 
                await playbackInstance.unloadAsync()

            if (this.props.nowPlaying.uri) {
                this.loadAudio()
            }
        }
    }

    async componentDidMount() {
        
        try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: false,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: false,
            staysActiveInBackground: false,
            playThroughEarpieceAndroid: true
        })
        } catch (e) {
            console.log(e)
        }

        this.loadAudio()
    }


    renderFileInfo() {
        const { playbackInstance } = this.state
        return playbackInstance && (
            <View style={styles.trackInfo}>
                <Text style={[styles.trackInfoText, styles.largeText]}>
                    {this.props.nowPlaying.title}
                </Text>
                <Text style={[styles.trackInfoText, styles.smallText]}>
                    {this.props.nowPlaying.artist}
                </Text>
            </View>
        )
    }

    saveTrack = () => {
        if (this.props.nowPlaying.id !== null) {
          fetchFuncs()
    
          //display heart icon, indicating that the track can either be liked or removed from likes
          return(
            <View style={styles.heart}>
              { !this.state.saved &&
                <Icon
                  name='ios-heart-empty'
                  type='ionicon'
                  color='#fff'
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
                  color='#fff'
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
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this.handlePlayPause}>
                    {this.state.isPlaying ? (
                    <Ionicons name='ios-pause' size={48} color='#fff' />
                    ) : (
                    <Ionicons name='ios-play-circle' size={48} color='#fff' />
                    )}
                </TouchableOpacity>

                { this.renderFileInfo() }

                { this.saveTrack() }
                
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        nowPlaying: state.nowPlaying
    }
}

export default connect(mapStateToProps)(AudioPlayer)

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
      color: '#fff',
    },
    heart: {
        
    },
    largeText: {
      fontWeight: "bold",
      fontSize: 12
    },
    smallText: {
      fontSize: 10
    },

  })
