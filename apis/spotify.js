import axios from 'axios';
import { AsyncStorage } from 'react-native';
import {rand, log} from "../methods";

(SPY = async () => {

    mapTopGenres = (res, timeRange) => {
        let midTermGenrePref = [],
            longTermGenrePref = []
    
        //add genres to array
        res.data.items.map( (e) => {
            e.genres.map( (i) => {
                if (i.length > 0)
                timeRange === "medium_term" ? midTermGenrePref.push(i) : longTermGenrePref.push(i)
            })
        })
    
        sortTopGenres = (arr, timeRange) => {
    
            let countGenres = arr.reduce( (allGenres, genre) => {
                if (genre in allGenres) {
                    allGenres[genre]++;
                }
                else {
                    allGenres[genre] = 1;
                }
                return allGenres;
            }, {} )
        
            let doSorting = () => {
                let sortable = []
                for (var genre in countGenres) {
                    sortable.push([genre, countGenres[genre]]);
                }
                sortable.sort((a, b) => {
                    return a[1] - b[1];
                });
        
                timeRange === "mid" ? midTermGenrePref = sortable.reverse() : longTermGenrePref = sortable.reverse()
            }
        
            doSorting()
            //GenrePref array is ready
        }
    
        //sort genres in arrays, by calling "sortTopGenres" function
        if (timeRange === "medium_term") 
            sortTopGenres(midTermGenrePref, "mid")
    
        if (timeRange === "long_term") 
            sortTopGenres(longTermGenrePref, "long")
    }
    

    //do something with the fetch response
    useRes = async (res, type, searchTerm, arr, discoverNew) => {
        let userTop = [],
            recomArtists = [],
            recomAlbums = [],
            topTracks = [],
            searchResult = undefined;
    
        switch (type) {
            case "fetchUserTop":
                log("fetchUserTop...")
                //maps users top artists and returns a random value
                mapUserTop = async () => {
                    res.data.items.map(e => {
                        userTop.push([e.name, e.id])
                    })
                }
                await mapUserTop()
                return userTop
    
            case "recommendArtist":
                log("recommendArtist...")

                mapRelatedArt = async () => {
                    res.data.artists.map( e=> {
                        if (e.popularity > 0) {
                            let mapUserTop = arr.map(i =>i[1]);
                            //push artists that are not in user's top listens to "recommended array"
                            if (discoverNew) {
                                if (!mapUserTop.includes(e.id))
                                    recomArtists.push([e.name, e.id, e.popularity])
                            //push artists that are in user's top listens to "recommended array"
                            } else {
                                recomArtists.push([e.name, e.id, e.popularity])
                            }
                        }
                    })  
                }
                await mapRelatedArt()
                //pick & return random related artist
                return rand(recomArtists)
    
            case "recommendAlbum":
                mapAlbums = async () => {
                    res.data.items.map( e=> {
                        recomAlbums.push([e.name, e.id])
                    })  
                }
                await mapAlbums()
                //pick & return random related album
                return rand(recomAlbums)
    
            case "topTracks":
                log("toptracks...")
                mapTopTracks = async () => {
                    res.data.tracks.map( e=> {
                        if (e.preview_url)
                        topTracks.push([e.name, e.id, e.artists.map(e=>e.name), e.preview_url, e.album.images])
                    })  
                }
                await mapTopTracks()
                //pick & return random top track
                return rand(topTracks);
            case "search":
                log("searching...")
                //search spotify for an artist
                searchSPY = async () => {
                    res.data.artists.items.map( e=> {
                        if (e.popularity > 0) {
                            if(e.name.toLowerCase() === searchTerm.toLowerCase()) {
                                searchResult = e.id
                            }
                        }
                    })
                } 
                await searchSPY()
                return searchResult
                
            default:
                return;
        }
    }
    
    reqParams = (timeRange, type, searchTerm, limit) => {
        switch (type) {
            case "fetchUserTop":
                log("limit: " + limit)
                return ({
                    limit: limit,
                    time_range: timeRange
                })
            case "search":
                return({
                    q: searchTerm,
                    type: "artist"
                })
            case "recommendAlbum":
            case "topTracks":
                return({
                    country: "from_token"
                })
            default:
                return undefined
        }
    }
})

export const makeSPYreq = async (arg = {}) => {
    SPY() //get protected namespace
    
    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');
    if (!SPYauthToken) return;

    arg = {
        url: arg.url || undefined,
        type: arg.type || undefined, //request type
        arr: arg.arr || undefined, // user top array
        timeRange: arg.timeRange || "medium_term",
        searchTerm: arg.searchTerm || undefined,
        discoverNew: arg.discoverNew, // bool
        limit: arg.limit || 40 //limit for "user top" list
    }

    const response = await axios.get(arg.url,
        {
            headers: {
                Authorization: `Bearer ${SPYauthToken}`
            },
            params: reqParams(arg.timeRange, arg.type, arg.searchTerm, arg.limit)
        })
        .then(
            async (res) => {
                return useRes(res, arg.type, arg.searchTerm, arg.arr, arg.discoverNew)
            }
        )
        .catch((error) => {
            log("spotify error: " + error);
        })
    
    return response
}



