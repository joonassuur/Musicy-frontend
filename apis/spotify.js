import * as React from 'react';
import axios from 'axios';

let longTermGenrePref = []
let midTermGenrePref = []

let longTermArtistPref = []
let midTermArtistPref = []

sortTopGenres = (arr, timeRange) => {
    console.log("*************************")
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
    //console.log(midTermGenrePref)

    /*         
    for (let key in countGenres) {
        if (countGenres.hasOwnProperty(key)) {

            if (countGenres[key] > 10)
            console.log(key + " -> " + countGenres[key]);
        }
    } 
    */
}

mapTopGenres = (res, timeRange) => {

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

mapTopArtists = (res, timeRange) => {

    res.data.items.map(e => {

        if (timeRange === "medium_term")
            midTermArtistPref.push(e.name)
            
        if (timeRange === "long_term")
            longTermArtistPref.push(e.name)

    })
    //ArtistPref array is ready
    console.log(midTermArtistPref)
}

makeReq = (res, timeRange, type) => {
    if (type === "userTop") {
        mapTopGenres(res, timeRange)
        mapTopArtists(res, timeRange)
    }
}

export default makeSPYreq = (url, token, type, timeRange, term) => {

    timeRange = timeRange || "medium_term"
    term = term || undefined

    axios.get(url,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: 50,
                time_range: timeRange
            }
        })
        .then(
            (res) => {
                makeReq(res, timeRange, type)
            }
        )
        .catch(function (error) {
            console.log(error);
        })

}




