import React, { useState, useEffect  } from 'react';
import {  
  Alert,
  ActivityIndicator,
  AsyncStorage,
  View, 
  StyleSheet, 
  Text,
  Picker,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'
import { ListItem, Icon, Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

import fetchFuncs from '../FetchFunctions';
import {rand, log, last, secondObj} from "../methods";
import AudioPlayer from '../components/AudioPlayer';

let playList = []
let failCount = 0

function LinksScreen(props) {

  //state hooks
  const [mood, setMood] = useState('general');
  const [playListAdded, setPlayList] = useState(false);
  const [loading, setLoading] = useState(false);

  //forces the state to update
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  addPlayList = async () => {
    //add playlist to user's account
    const userID = await AsyncStorage.getItem('spotifyID')
    const playListID = await createPlayList(userID, mood)
    //add songs to created playlist
    await addToPlayList( playListID, playList.map(e => e.id) ) 
    setPlayList(true)
  }

  handlePlayPause = (uri, title, artist, key) => {
    if (uri)
      props.setNowPlaying({        
        title: title,
        id: null,
        artist: artist,
        uri: uri,          
        imageSource: null,
        key: key
      })

      //setSong({ uri: uri, title: title, artist: artist, key: key })
  }

  renderPlayList = () => {

    if (playList.length > 0) {

      return(
        <View style={styles.playListCont}>
          <ScrollView>
          { playList.map((l, i) => (
              <ListItem
                titleStyle={{ fontSize: 14 }}
                subtitleStyle={{ fontSize: 12 }}
                key={i}
                title={l.song}
                subtitle={l.artist}
                onPress={()=> this.handlePlayPause(l.preview, l.song, l.artist, i)}
                rightElement={ 
                  !l.preview && 
                  <Text style={{fontSize: 9, fontStyle: "italic"}}>
                    Preview not available
                  </Text> }
                bottomDivider
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
    
    if (failCount > 10) {
      failCount = 0
      log("search failed")
      setLoading(false)
      return
    }

    recoms = await generatePlayList({
      timeRange: "medium_term", 
      limit: 10,
      mood: mood
    });

    if (recoms && recoms.length > 5) {

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

  //aka componentDidMount()
  useEffect(() => {
    //get namespace for Spotify API request functions
    fetchFuncs() 
  });  

  return (
    <View style={styles.container}>
      
      <Text>Select mood to generate playlist</Text>
      
      <View style={styles.menu}>
        <Picker
          selectedValue={mood}
          style={ { height: 50, width: 150 } }
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
            color: "white",
            fontSize: 14,
          }}
        />

        <View style={styles.playListIcon}>
          { playListAdded ?
              <Icon
                name='playlist-add-check'
                type='material'
                color='#000'
              /> :
              <Icon
                name='playlist-add'
                type='material'
                color='#000'
                onPress={ ()=> addPlayList() }
              /> }
        </View>
      </View>

      { loading &&
          <View style={styles.spinner}>
            <ActivityIndicator size='large' />
          </View>
      }

      { this.renderPlayList() }

    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Playlist generator',
};


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

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: '#fff',
  },
  menu: {
    backgroundColor: '#fff',
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#153737"
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
    width:"100%"
  },
  player: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#000"
  }

});
