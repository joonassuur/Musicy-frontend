import makeReq from './apis/request';
import {SPYfetchURL, LFMfetchURL} from './apis/URL';
import {rand, log, last, secondObj} from "./methods";

//Spotify API request functions

export default async () => {

    fetchUserTop = async (timeRange, limit, type) => {
        //get user's top artists/genres or tracks from Spotify
        return await makeReq({
          url: type === "userTopTracks" ? SPYfetchURL("topTracks") : SPYfetchURL("topArtists"), 
          type: type || "userTopArtists",
          timeRange: timeRange,
          limit: limit
        })
    }
    
    fetchRecomArt = async (discoverNew, timeRange, limit) => {
        //get related artists based on user's Spotify top played artists
        let userTopArr = await this.fetchUserTop(timeRange, limit),
            //ranUserTop = grab random value from user's Spotify top played. userTopArr [0] = name, [1] = ID
            ranUserTop = rand(userTopArr),
            final = undefined; //final artist value to be returned 
    
        if (discoverNew) {
        //if bool "discoverNew" is true, make "similar artists" requests to both Spotify and LFM. Both return one random value that is not in users current top played (inside userTopArr value) for given period.
            let SPYrecom = await makeReq({ //Spotify Recommendation
                url: SPYfetchURL("rltdArt", ranUserTop[1]), 
                type: "recommendArtist", 
                arr: userTopArr,
                discoverNew: discoverNew
            })
            let LFMrecom = await makeReq({ //LFM Recommendation
                url: LFMfetchURL("rltdArt", ranUserTop[0]), 
                api: "lastfm",
                type: "recommendArtist", 
                arr: userTopArr,
                discoverNew: discoverNew
            })
            //Pick randomly either Spotify or LFM recommendation and return it.
            let ranOverall = rand([SPYrecom[0], LFMrecom]);
                ranOverall === SPYrecom[0] ? 
                // if the picked ranOverall value is from Spotify, exit here...
                final = SPYrecom[1] :
                // ...else search the LFM recommendation on Spotify
                final = await makeReq({
                url: SPYfetchURL("search"), 
                type: "search", 
                searchTerm: ranOverall
            })

            return final
        }
        
        //if bool "discoverNew" is false, pick an artist already in user's top played for the selected period
        if (ranUserTop[1]) { return ranUserTop[1] }
        return undefined
    }
    
    fetchRecomAlbum = async (discoverNew, timeRange) => {
        //first fetch an artist ID, then make an album request based on said ID
        //not in use currently
        let id = await this.fetchRecomArt(discoverNew, timeRange),
            album = await makeReq({
                url: SPYfetchURL("album", id), 
                type: "recommendAlbum"
            });
        return album;
    }
    
    fetchRecommendedTracks = async (discoverNew, timeRange, limit) => {
        //first fetch an artist ID, then make a track request based on said ID
        let id = await this.fetchRecomArt(discoverNew, timeRange, limit),
            track = await makeReq({
                url: SPYfetchURL("track", id), 
                type: "recommendedTracks"
            });

        return track
    }

    fetchSeedGenres = async (topGenres) => {
        //fetch seedable genres and match them against user's top listened genres. returns the ones that match
        let seedGenres = [],
            regex = /-/gi
        
        let fetchGenreSeeds = await makeReq({
            url: SPYfetchURL("genreSeeds"), 
            type: "genreSeeds"
        });

        fetchGenreSeeds.map( e=>{
            topGenres.map( l=> {
               if(e.replace(regex, ' ') === l.replace(regex, ' '))  {
                   if(!seedGenres.includes(e))
                    seedGenres.push(e)
               }
            })
        })

        return seedGenres;
    }

    saveTrack = async (action, id) => {

        if (action === "save") {
            return await makeReq({
                url: SPYfetchURL("saveTrack", id), 
                type: "saveTrack",
                method: "modify"
            });
        }
        if (action === "remove") {
            return await makeReq({
                url: SPYfetchURL("saveTrack", id), 
                type: "removeTrack",
                method: "modify"
            });
        }

    }

    fetchAttr = async (mood, audioFeatures) => {
        switch (mood) {
            case "general":
                return ({
                    target_danceability: audioFeatures[0],
                    target_energy: audioFeatures[1],
                    target_valence: audioFeatures[2],
                    target_tempo: audioFeatures[3],
                    target_acousticness: audioFeatures[4]
                })
            case "uplifting":
                //perfect!
                return ({
                    min_danceability: 0.4,
                    min_valence: 0.65,
                    min_energy: 0.4,
                })
            case "energetic":
                return ({
                    min_energy: 0.6,
                    min_valence: 0.4,
                    min_tempo: 100,
                    max_acousticness: 0.4
                })
            case "calm":
                return ({
                    max_energy: 0.52,
                    max_tempo: 99,
                    min_valence: 0.2,
                    min_danceability: 0.2,
                    max_danceability: 0.7,
                })
            case "gloomy":
                return ({
                    max_valence: 0.3,
                    max_energy: 0.4,
                    max_danceability: 0.5
                })
            default: return;
        }
    }

    generatePlayList = async(arg = {}) => {

        arg = {
            timeRange: arg.timeRange || undefined,
            limit: arg.limit || undefined,
            mood: arg.mood || "general"
        }

        let fetchUserTopArt = await fetchUserTop(arg.timeRange, arg.limit),
            fetchUserTopTracks = await fetchUserTop(arg.timeRange, arg.limit, "userTopTracks"),
            fetchRelatedArt = await fetchRecomArt(false, arg.timeRange, arg.limit), // make it so it returns more than 1 value
            topArtists = fetchUserTopArt.map(e=>e[1]).flat(Infinity),
            topTracks = fetchUserTopTracks.map(e=>e[1]).flat(Infinity),
            topGenres = fetchUserTopArt.map(e=>e[2]).flat(Infinity),   
            seedableGenres = await fetchSeedGenres(topGenres)

        topArtists.splice(2)
        seedableGenres.splice(3)

        topTracks.splice(3)
       

        topArtists.push(fetchRelatedArt)

        //do analysis on user's top tracks
        //[0] = danceability, [1] = energy, [2] = valence, [3] = tempo, [4] = acousticness
        let audioFeatures = await makeReq({
            url: SPYfetchURL("audioFeatures"), 
            type: "audioFeatures",
            searchTerm: topTracks.join()
        });

        
        //fetch recommendations based on user's top tracks analysis
        let recoms = await makeReq({
            url: SPYfetchURL("playlist"), 
            type: "seedsRecom",
            limit: arg.limit,
            seeds: {
                seed_artists: topArtists.join(), //fetchRelatedArt, //take random related artist with every request
                seed_genres: undefined,
                seed_tracks: undefined,
                attributes: await this.fetchAttr(arg.mood, audioFeatures)
            }
        }); 

        return recoms 
    }

    createPlayList = async (id, mood) => {

        capitalize = ([firstLetter, ...rest]) => {
            return [firstLetter.toLocaleUpperCase(), ...rest].join('');
        }

        let playListID = await makeReq({
            url: SPYfetchURL("createPlayList", id), 
            type: "createPlayList",
            searchTerm: capitalize(mood),
            method: "modify"
        });

        return playListID;
        
    }

    addToPlayList = async (id, ids) => {

        await makeReq({
            url: SPYfetchURL("addToPlayList", id),
            type: "addToPlayList",
            searchTerm: ids,
            method: "modify"
        })

    }

}

