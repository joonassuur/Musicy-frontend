import React from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    Text
} from 'react-native';

import {Audio} from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import {omitLast} from "../methods"

export default class AudioPlayer extends React.Component {
    state = {
        isPlaying: false,
        playbackInstance: null,
        volume: 1.0,
        isBuffering: false,
        uri: ''
    }

    handlePlayPause = async () => {
        if (this.props.nowPlaying.uri !== null) {
            const { isPlaying, playbackInstance } = this.state
            isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        
            this.setState({
                isPlaying: !isPlaying
            })
        } 
    }

    async loadAudio() {
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
            this.setState({playbackInstance})
        } catch (e) {
            console.log(e)
        }
    }
   
    onPlaybackStatusUpdate = status => {
        this.setState({
            isBuffering: status.isBuffering
        })
    }

    async componentDidUpdate(prevProps) {
        const { playbackInstance} = this.state
        if (this.props.nowPlaying !== prevProps.nowPlaying) {
            if(playbackInstance) 
                await playbackInstance.unloadAsync()

            if (this.props.nowPlaying.uri !== null) {
                this.loadAudio()
            }
        }
    }


    async componentDidMount() {
        try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true
        })
        } catch (e) {

            console.log(e)
        }
    }

    renderFileInfo() {
        const { playbackInstance } = this.state
        return playbackInstance ? 
        (
            <View style={styles.trackInfo}>
                <Text style={[styles.trackInfoText, styles.largeText]}>
                    {this.props.nowPlaying.title}
                </Text>
                <Text style={[styles.trackInfoText, styles.smallText]}>
                    {this.props.nowPlaying.artist}
                </Text>
            </View>
        ) : null
    }

    render() {
        return(
            <View style={styles.container}>
                <Image
                    style={styles.albumCover}
                    source={{ uri: this.props.nowPlaying.imageSource }}
                />
                <View style={styles.controls}>

                    <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
                        {this.state.isPlaying ? (
                        <Ionicons name='ios-pause' size={48} color='#444' />
                        ) : (
                        <Ionicons name='ios-play-circle' size={48} color='#444' />
                        )}
                    </TouchableOpacity>

                </View>
                {this.renderFileInfo()}
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    albumCover: {
      width: 250,
      height: 250
    },
    trackInfo: {
      padding: 40,
      backgroundColor: '#fff'
    },
    trackInfoText: {
      textAlign: 'center',
      flexWrap: 'wrap',
      color: '#550088'
    },
    largeText: {
      fontSize: 22
    },
    smallText: {
      fontSize: 16
    },
    control: {
      margin: 20
    },
    controls: {
      flexDirection: 'row'
    }
  })