import axios from 'axios';
import { AsyncStorage } from 'react-native';
import SPY from './spotify';
import LFM from './lastfm';
import {rand, log} from "../methods";

export default makeReq = async (arg = {}) => {

    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');
    if (!SPYauthToken) return;

    arg = {
        url: arg.url || undefined,
        api: arg.api || "spotify",
        type: arg.type || undefined, //request type
        arr: arg.arr || undefined, // user top array
        timeRange: arg.timeRange || "medium_term",
        searchTerm: arg.searchTerm || undefined,
        discoverNew: arg.discoverNew, // bool. defaults to falsy
        limit: arg.limit || 40, //limit for "user top" list
        seeds: arg.seeds || undefined,
        method: arg.method || undefined
    }

    //get corresponding protected namespace    
    arg.api === "lastfm" ? LFM() : SPY()

    // modify user's account (save tracks or playlists, etc.)
    if (arg.method === "modify" ) {

        const playListName = { name: arg.searchTerm };
        const trackIDs = { uris : arg.searchTerm };

        const response = await fetch(arg.url, {
            method: arg.type === "saveTrack" ? "PUT" : arg.type === "removeTrack" ? "DELETE" :  "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SPYauthToken}`
            },
            body: JSON.stringify(
                arg.type === "createPlayList" ? playListName : arg.type === "addToPlayList" ? trackIDs : undefined
            )
        })
        .then( (res) => {
            if (arg.type === "createPlayList") {
                //playlist successfully created
                let url = 'https://api.spotify.com/v1/playlists/'
                let id = res.headers.map.location.substring(37, res.headers.map.location.length)
    
                if (res.headers.map.location.includes(url)) {
                    return id
                }
            }
            if ( (arg.type === "saveTrack" || arg.type === "removeTrack") && res.status === 200) {
                //track successfully added to favorites
                return 200
            }
        })
        .catch( (err) => console.log(arg.type + " " + err) )

        return response;
    }

    // every other request (using GET method)
    const response = await axios.get(arg.url,
        arg.api === "lastfm" ? undefined :
        {
            headers: {
                "Authorization": `Bearer ${SPYauthToken}`
            },
            params: reqParams(arg.timeRange, arg.type, arg.searchTerm, arg.limit, arg.seeds)
        })
        .then(
            async (res) => {
                if (arg.api === "lastfm") {                
                    return useRes(res, arg.type, arg.arr, arg.discoverNew) 
                } else {
                    return useRes(res, arg.type, arg.searchTerm, arg.arr, arg.discoverNew)
                }
            }
        )
        .catch((error) => {
            arg.api === "lastfm" ? log("LFM error: " + error) : log("spotify error: " + error);
        })
    
    return response
}

