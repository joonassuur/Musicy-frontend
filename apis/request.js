import axios from 'axios';
import { AsyncStorage } from 'react-native';
import SPY from './spotify'
import LFM from './lastfm'
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
        limit: arg.limit || 40 //limit for "user top" list
    }

    //get corresponding protected namespace    
    arg.api === "lastfm" ? LFM() : SPY()

    const response = await axios.get(arg.url,
        arg.api === "lastfm" ? undefined :
        {
            headers: {
                Authorization: `Bearer ${SPYauthToken}`
            },
            params: reqParams(arg.timeRange, arg.type, arg.searchTerm, arg.limit)
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

