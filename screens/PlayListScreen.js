import React, { useState, useEffect } from 'react';
import {  
  ActivityIndicator,
  AsyncStorage,
  View, 
  StyleSheet, 
  Text,
  Picker,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux'
import { ListItem, Icon, Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';

import fetchFuncs from '../FetchFunctions';
import {log} from "../methods";

let playList = []
let failCount = 0
let interval;

function LinksScreen(props) {

  //state hooks
  const [mood, setMood] = useState('general');
  const [playListAdded, setPlayList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(false);
  //forces the state to update
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const theme = props.theme

  addPlayList = async () => {
    //add playlist to user's account
    const userID = await AsyncStorage.getItem('spotifyID')
    const playListID = await createPlayList(userID, mood)
    //add songs to created playlist
    await addToPlayList( playListID, playList.map(e => e.id) ) 
    setPlayList(true)
  }

  handlePlayPause = (uri, title, artist, key, id) => {
    
    let slicedID = id.slice(14)    
    clearTimeout( interval );
    setSongLoading(true)

    interval = setTimeout(() => {
      if (uri) {
        props.setNowPlaying({        
          title: title,
          id: slicedID,
          artist: artist,
          uri: uri,          
          imageSource: null,
          key: key
        })
        setSongLoading(false)
      }
    }, 850);

  }

  renderPlayList = () => {

    if (playList.length > 0) {

      return(
        <View style={styles.playListCont}>
          <ScrollView>
            { playList.map((l, i) => (
              <ListItem
                titleStyle={{ fontSize: 13, color: theme.text, fontWeight: "bold" }}
                containerStyle={styles.listItem}
                subtitleStyle={{ fontSize: 12, color: theme.text }}
                key={i}
                title={l.song}
                subtitle={l.artist}
                onPress={()=> this.handlePlayPause(l.preview, l.song, l.artist, i, l.id)}
                rightElement=
                { 
                  !l.preview ? 
                    <Text style={{fontSize: 9, fontStyle: "italic", color: theme.text}}>
                      Preview not available
                    </Text> : 
                  songLoading ?
                    <ActivityIndicator size='small' color={theme.spinner}/> :  
                    <Icon
                      name='ios-play'
                      type='ionicon'
                      color={theme.playIcon}
                    />
                }
              /> )) }
          </ScrollView>
        </View>
      )
    }
  }

  handlePlaylist = async () => {

    setLoading(true)
    setPlayList(false)

    playList=[]
    let recoms = null;
    
    if (failCount > 5) {
      failCount = 0
      alert('Not enough lstening data for this playlist')
      setLoading(false)
      return
    }

    recoms = await generatePlayList({
      timeRange: "short_term", 
      limit: 50,
      mood: mood
    });

    if (recoms && recoms.length > 10) {

      failCount = 0
      recoms.map(e=>{
        playList.push({ id: 'spotify:track:' + e[0], song: e[1], artist: e[2], preview: e[3] })
      })

      forceUpdate()
      setLoading(false)      
      
      return;
    }

    failCount++
    this.handlePlaylist()

  }

  useEffect(() => {
    //get namespace for Spotify API request functions
    fetchFuncs() 
  });  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
    },
    gradient: {
      flex:1,
      height: "100%",
      width: "100%",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
    },
    menu: {
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      borderRadius: 20,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: theme.buttonBG
    },
    playListIcon: {
      marginLeft: 10
    },
    spinner: {
      flex: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    playListCont: {
      flex: 4,
      width:"100%",
    },
    listItem: {
      backgroundColor: theme.listItem, 
      borderTopWidth: 1.5, 
      borderTopColor: theme.listItemBorder,
    }
  
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        style={ styles.gradient }
        colors={theme.backgroundGrad}
      >
        <View style={styles.menu}>
          <Picker
            selectedValue={mood}
            style={ { height: 50, width: 150, color: theme.text } }
            onValueChange={ (itemValue) => setMood(itemValue) }
            >
            <Picker.Item label="General" value="general" />
            <Picker.Item label="Uplifting" value="uplifting" />
            <Picker.Item label="Energetic" value="energetic" />
            <Picker.Item label="Calm/Relaxed" value="calm" />
            <Picker.Item label="Gloomy" value="gloomy" />
          </Picker>

          <Button onPress={ ()=> this.handlePlaylist() }
            title="Generate playlist"
            buttonStyle={styles.button}
            titleStyle={{
              color: theme.buttonTXT,
              fontSize: 14,
            }}
          />

          <View style={styles.playListIcon}>
            { playListAdded ?
                <Icon
                  name='playlist-add-check'
                  type='material'
                  color={theme.text}
                /> :
                <Icon
                  name='playlist-add'
                  type='material'
                  color={theme.text}
                  onPress={ ()=> addPlayList() }
                /> }
          </View>
        </View>

        { loading &&
            <View style={styles.spinner}>
              <ActivityIndicator size='large' color={theme.spinner}/>
            </View>
        }

      { this.renderPlayList() }
      </LinearGradient>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Playlist generator',
};


const mapStateToProps = state => {
  return {
    nowPlaying: state.nowPlaying,
    playerParams: state.playerParams,
    loading: state.loading,
    theme: state.theme
  }
}

const setNowPlaying = (track) => ({ type: 'SET_NOWPLAYING', track })

const mapDispatchToProps = dispatch => {
  return {
    setNowPlaying: (track) => dispatch(setNowPlaying(track))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)


