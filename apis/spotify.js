import {rand, log} from "../methods";

export default SPY = async () => {

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
            
        switch (type) {
            case "userTopArtists":
                log("userTopArtists...")
                //maps users top artists
                let userTopArt = []
                res.data.items.map(e => {
                    userTopArt.push([e.name, e.id, e.genres])
                })
                return userTopArt

            case "userTopTracks":
                log("userTopTracks...")
                //maps users top artists
                let userTopTracks = []
                res.data.items.map(e => {
                    userTopTracks.push([e.artists[0].name, e.id, e.name])
                })
                return userTopTracks
    
            case "recommendArtist":
                log("recommendArtist...")
                //recommends similar artists based on single input artist ID
                let recomArtists = []

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
                //pick & return random related artist
                return rand(recomArtists)
    
            case "recommendAlbum":
                log("recommendedAlbum...")
                let recomAlbums = []

                res.data.items.map( e=> {
                    recomAlbums.push([e.name, e.id])
                })  
                //pick & return random related album
                return rand(recomAlbums)
    
            case "recommendedTracks":
                log("recommendedTracks...")
                let topTracks = []

                res.data.tracks.map( e=> {
                    if (e.preview_url)
                    topTracks.push([e.name, e.id, e.artists.map(e=>e.name), e.preview_url, e.album.images])
                })  
                //pick & return random top track
                return rand(topTracks);

            case "search":
                log("searching...")
                //search spotify for an artist, based on name string
                let result = undefined;
                search = async () => {
                    res.data.artists.items.map( e=> {
                        if (e.popularity > 0) {
                            if(e.name.toLowerCase() === searchTerm.toLowerCase()) {
                                result = e.id
                            }
                        }
                    })
                }
                await search()
                return result;
                
            case "genreSeeds":
                //get all available genres that can be used as seeds
                return res.data.genres

            case "getArtist":
                //get info on an artist. currently returns genres
                return res.data.artists[0].genres;

            case "seedsRecom":
                log("seedsRecom...")
                //get recommendations based on seeds
                let recoms = []
                
                res.data.tracks.map( e=> {
                    recoms.push([e.id, e.name, e.artists[0].name, e.preview_url ])
                })

                return recoms;

            case "audioFeatures":
                let features = [[],[],[],[],[],[],[]],
                    reducer = (accumulator, currentValue) => accumulator + currentValue;

                res.data.audio_features.map(e=>{
                    features[0].push(e.danceability)
                    features[1].push(e.energy)
                    features[2].push(e.valence)
                    features[3].push(e.tempo)
                    features[4].push(e.acousticness)
                    features[5].push(e.instrumentalness)
                    features[6].push(e.loudness)
                })

                let averages = features.map( e => (e.reduce(reducer)/e.length) )
                return averages

            case "profile":
                //get user profile
                return res.data.id

            default:
                return;
        }
    }
    
    reqParams = (timeRange, type, searchTerm, limit, seeds) => {

        switch (type) {
            case "userTopArtists":
            case "userTopTracks":
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
            case "recommendedTracks":
                return({
                    country: "from_token"
                })
            case "seedsRecom":
                const attributes = seeds.attributes
                return({
                    market: "from_token",
                    limit: limit,
                    seed_artists: seeds.seed_artists,
                    seed_genres: seeds.seed_genres,
                    seed_tracks	: seeds.seed_tracks,
                    target_danceability: attributes.target_danceability,
                    target_energy: attributes.target_energy,
                    target_valence: attributes.target_valence,
                    target_tempo: attributes.target_tempo,
                    target_acousticness: attributes.target_acousticness,
                    target_instrumentalness: attributes.target_instrumentalness,
                    target_loudness: attributes.target_loudness,
                    min_danceability: attributes. min_danceability,
                    min_energy: attributes.min_energy,
                    min_valence: attributes.min_valence,
                    min_tempo: attributes.min_tempo,
                    min_acousticness: attributes.min_acousticness,
                    min_instrumentalness: attributes.min_instrumentalness,
                    min_loudness: attributes.min_loudness,
                    max_danceability: attributes. max_danceability,
                    max_energy: attributes.max_energy,
                    max_valence: attributes.max_valence,
                    max_tempo: attributes.max_tempo,
                    max_acousticness: attributes.max_acousticness,
                    max_instrumentalness: attributes.max_instrumentalness,
                    max_loudness: attributes.max_loudness,
                })
            case "audioFeatures":
                return({
                    ids: searchTerm
                })
            case "createPlayList":
                return({
                    name: searchTerm,
                })
            default:
                return undefined
        }
    }
}

