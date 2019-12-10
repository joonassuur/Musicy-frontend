import axios from 'axios';
import { AsyncStorage } from 'react-native';

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

mapTopArtists = async (res) => {
    let artistPref = []

    mapArtistsToArray = async () => {
        res.data.items.map(e => {
            artistPref.push([e.name, e.id])
        })
    }

    await mapArtistsToArray()
    return artistPref
}

//do something with the fetch response
useRes = async (res, type, searchTerm, arr, discoverNew) => {
    let recomArtists = [],
        recomAlbums = [],
        searchResult = [];

    switch (type) {
        case "fetchUserTop":
            //maps users top artists and returns a random value
            let randomTop = await mapTopArtists(res)
            return randomTop

        case "recommendArtist":
            mapRelatedArt = async () => {
                res.data.artists.map( e=> {
                    let mapUserTop = arr.map(i =>i[1]);
                    //push artists that are not in user's top listens to "recommended array"
                    if (discoverNew) {
                        if (!mapUserTop.includes(e.id)) {
                            recomArtists.push([e.name, e.id])
                        }
                    } else {
                        recomArtists.push([e.name, e.id])
                    }
                })  
            }
            await mapRelatedArt()
            console.log("discover " + discoverNew)
            console.log("recomArtists:")
            console.log(recomArtists)
            //pick & return random related artist
            return recomArtists[Math.floor(Math.random() * recomArtists.length)]

        case "recommendAlbum":
            mapRelatedArt = async () => {
                res.data.items.map( e=> {
                    recomAlbums.push([e.name, e.id])
                })  
            }
            await mapRelatedArt()
            //pick & return random related album
            return recomAlbums[Math.floor(Math.random() * recomAlbums.length)]

        case "search":
            console.log("searching...")
            //search spotify for an artist
            searchSPY = async () => {
                res.data.artists.items.map( e=> {
                    if(e.name.toLowerCase() === searchTerm.toLowerCase()) {
                        searchResult = [e.name, e.id]
                    } 
                })
            } 
            await searchSPY()
            return searchResult
            
        default:
            return;
    }
}

reqParams = (timeRange, type, searchTerm) => {
    switch (type) {
        case "fetchUserTop":
            return ({
                limit: 20,
                time_range: timeRange
            })
        case "search":
            return({
                q: searchTerm,
                type: "artist"
            })
        default:
            return undefined
    }
}


export const makeSPYreq = async (arg) => {

    const SPYauthToken = await AsyncStorage.getItem('SPYauthToken');

    arg = {
        url: arg.url || undefined,
        type: arg.type || undefined,
        arr: arg.arr || undefined,
        timeRange: arg.timeRange || "medium_term",
        searchTerm: arg.searchTerm || undefined,
        discoverNew: arg.discoverNew || true,
    }

    const response = await axios.get(arg.url,
        {
            headers: {
                Authorization: `Bearer ${SPYauthToken}`
            },
            params: reqParams(arg.timeRange, arg.type, arg.searchTerm)
        })
        .then(
            async (res) => {
                return useRes(res, arg.type, arg.searchTerm, arg.arr, arg.discoverNew)
            }
        )
        .catch((error) => {
            console.log("spotify error: " + error);
        })
    
    return response
}



