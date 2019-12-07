import * as React from 'react';
import axios from 'axios';

mapTopGenres = (res, timeRange) => {
    let midTermGenrePref = [],
        longTermGenrePref = []

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

    res.data.items.map( (e) => {
        e.genres.map( (i) => {
            if (i.length > 0)
            timeRange === "medium_term" ? midTermGenrePref.push(i) : longTermGenrePref.push(i)
        })
    })

    if (timeRange === "medium_term") 
        sortTopGenres(midTermGenrePref, "mid")

    if (timeRange === "long_term") 
        sortTopGenres(longTermGenrePref, "long")
}

mapTopArtists = async (res, timeRange) => {
    let midTermArtistPref = []
    let longTermArtistPref = []
    let randArt = null    

    mapArtistsToArray = async () => {
        res.data.items.map(e => {
            if (timeRange === "medium_term") {
                midTermArtistPref.push(e.id)
            }
                
            if (timeRange === "long_term") {
                longTermArtistPref.push(e.id)
            }   
        })
    }

    await mapArtistsToArray()
    //ArtistPref array is ready
    pickRandomArtist = async () => {
        //pick random artist from the array
        if (timeRange === "medium_term") {
            randArt = midTermArtistPref[Math.floor(Math.random() * midTermArtistPref.length)]
        }
        if (timeRange === "long_term") {
            randArt = longTermArtistPref[Math.floor(Math.random() * longTermArtistPref.length)]
        }
    }
    await pickRandomArtist()
    return randArt
}

//do something with the fetch response
useRes = async (res, timeRange, type) => {
    let relatedArtists = [],
        randomTop = null

    if (type === "userTop") {
        //let topGenres = await mapTopGenres(res, timeRange)
        //maps users top artists and returns a random value
        randomTop = await mapTopArtists(res, timeRange)
        return randomTop
    }
    if (type === "relatedArt") {
        mapRelatedArt = async () => {
            res.data.artists.map( e=> {
                relatedArtists.push([e.name, e.id])
            })  
        }
        await mapRelatedArt()

        //pick & return random related artist
        return await relatedArtists[Math.floor(Math.random() * relatedArtists.length)]
    }
}

reqParams = (timeRange, id, type) => {
    switch (type) {
        case "userTop":
            return ({
                limit: 50,
                time_range: timeRange
            })
        case "relatedArt":
            return({
                id: id
            })
        default:
            return undefined
    }
}

export const makeSPYreq = async (url, token, type, timeRange) => {
    
    timeRange = timeRange || "medium_term"

    const response = await axios.get(url,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: reqParams(timeRange, type)
        })
        .then(
            async (res) => {
                return useRes(res, timeRange, type)
            }
        )
        .catch((error) => {
            console.log(error);
        })
    
    return response
}

