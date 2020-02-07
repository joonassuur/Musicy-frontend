import makeReq from './apis/request';
import {SPYfetchURL, LFMfetchURL} from './apis/URL';
import {rand, log} from "./methods";

//Spotify API request functions

export default async () => {

    fetchArtist = async (ids) => {
        //get info on an artists. currently returns genres
        return await makeReq({
            url: SPYfetchURL("getArtist", ids), 
            type: "getArtist",
        })
    }

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
        //topGenres - user's top genres
        //fetch seedable genres and match them against user's top listened genres. returns the ones that match
        let seedGenres = [], 
            regex = /-/gi
        
        let fetchGenreSeeds = await makeReq({
            url: SPYfetchURL("genreSeeds"), 
            type: "genreSeeds"
        });

        fetchGenreSeeds.map( e => {
            topGenres.map( l => {
                if ( l.includes(e) ) {
                    if ( !seedGenres.includes(e) )
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
                return ({
                    min_valence: 0.6,
                })
            case "energetic":
                return ({
                    min_energy: 0.6,
                    min_valence: 0.4,
                    min_tempo: 150,
                })
            case "calm":
                return ({
                    max_energy: 0.5,
                    max_tempo: 100,
                    min_valence: 0.5,
                })
            case "gloomy":
                return ({
                    max_valence: 0.45,
                    max_danceability: 0.5
                })
            default: return;
        }
    }

    fetchMoods = (mood, genres) => {

        const uplifting = ["acoustic","alt-rock","alternative","ambient","anime","bossanova","chicago-house","classical","comedy","dance","drum-and-bass","edm","electro","electronic","folk","funk","garage","gospel","groove","guitar","happy","hard-rock","hardcore","heavy-metal","hip-hop","house","idm","indie","indie-pop","j-dance","j-idol","j-pop","j-rock","jazz","k-pop","metal","metal-misc","mpb","new-age","opera","piano","pop","power-pop","progressive-house","psych-rock","punk","punk-rock","r-n-b","reggae","reggaeton","rock","rock-n-roll","rockabilly","ska","soul","summer","trance","trip-hop","work-out"]
        const energetic = ["alt-rock","afrobeat","alternative","breakbeat","chicago-house","club","dance","dancehall","death-metal","deep-house","detroit-techno","drum-and-bass","dubstep","edm","electro","electronic","emo","grindcore","grunge","hard-rock","hardcore","hardstyle","heavy-metal","hip-hop","house","metal","metal-misc","metalcore","minimal-techno","party","progressive-house","punk","punk-rock","reggaeton","rock","techno","trance","work-out"]
        const calm = ["acoustic","afrobeat","alt-rock","ambient","black-metal","blues","bossanova","chicago-house","chill","classical","country","deep-house","detroit-techno","drum-and-bass","dub","electro","electronic","folk","gospel","groove","hard-rock","heavy-metal","hip-hop","house","idm","indie","indie-pop","metal","metal-misc","minimal-techno","new-age","opera","piano","pop","post-dubstep","power-pop","psych-rock","r-n-b","rainy-day","reggae","rock","rock-n-roll","rockabilly","romance","ska","sleep","songwriter","soul","study","summer","synth-pop","trance","trip-hop"]
        const gloomy = ["acoustic","alt-rock","alternative","ambient","black-metal","blues","chicago-house","chill","classical","country","death-metal","deep-house","detroit-techno","drum-and-bass","electro","electronic","emo","folk","garage","goth","grindcore","grunge","guitar","hard-rock","hardcore","heavy-metal","hip-hop","idm","indie","indie-pop","industrial","jazz","k-pop","metal","metal-misc","metalcore","minimal-techno","piano","post-dubstep","psych-rock","punk","punk-rock","r-n-b","rainy-day","rock","romance","sad","singer-songwriter","sleep","songwriter","soul","study","synth-pop","techno","trance","trip-hop"]

        let activeMood;
        let matchedGenres = []
        let random5 = []

        randTopGenre = () => {
            return matchedGenres[Math.floor(Math.random() * matchedGenres.length)];
        }
        
        mapGenres = () => {

            switch (mood) {
                case "uplifting":
                    activeMood = uplifting
                break;
                case "energetic":
                    activeMood = energetic
                break;
                case "calm":
                    activeMood = calm
                break;
                case "gloomy":
                    activeMood = gloomy
                break;
            }
            activeMood.map( e => {
                if (genres.includes(e)) {
                    if ( !matchedGenres.includes(e) ) 
                        matchedGenres.push(e)
                }
            })
            for (let i = 0; i < 5; i++) {
                let x = randTopGenre()
                if (!random5.includes(x) )
                    random5.push(x)
            }
        }

        mapGenres()

        return random5
    }


    generatePlayList = async(arg = {}) => {

        arg = {
            timeRange: arg.timeRange || undefined,
            limit: arg.limit || undefined,
            mood: arg.mood || "general"
        }

        let fetchUserTopArt = await fetchUserTop(arg.timeRange, 50),
            fetchUserTopTracks = await fetchUserTop(arg.timeRange, 50, "userTopTracks"),
            fetchRelatedArt = await fetchRecomArt(false, arg.timeRange, 50), //fetch a related artist to user's top
            topArtists = fetchUserTopArt.map(e=>e[1]).flat(Infinity),
            topTracks = fetchUserTopTracks.map(e=>e[1]).flat(Infinity),
            topGenres = fetchUserTopArt.map(e=>e[2]).flat(Infinity),   
            randomlyPickedArtists = []; //random artists from user top

        topGenres = topGenres.map(e => (
            e.replace(/ /gi, '-')
        ))

        let seedableGenres = await fetchSeedGenres(topGenres), //genres you can use to seach stuff on spotify
        
        pickRandomTop5art = async () => {
            //take 5 random artists from user's top (50 by default), push them to a separate array
            randTopArtist = () => {
                return topArtists[Math.floor(Math.random() * topArtists.length)];
            }
            for (let i = 0; i < 4; i ++) {
                if ( !randomlyPickedArtists.includes( randTopArtist()) )
                    randomlyPickedArtists.push( randTopArtist() )
            }

            //detect if picked artists have any that do not have listed genres by Spotify. if so, remove those artists, because it's hard to get "similar songs" matches for them
            randomlyPickedArtists.map(async (e, i) => {
                let genres = await fetchArtist(e)

                if (genres.length < 1) {
                    randomlyPickedArtists.splice(i, 1)
                }
            })
        }

        let genres;

        arg.mood === "general" ? await pickRandomTop5art() : genres = await fetchMoods(arg.mood, seedableGenres)        
        
        seedableGenres.splice(5)
        topTracks.splice(100)        

        //add a related artist to the user's top artists array
        if (!randomlyPickedArtists.includes(fetchRelatedArt))
            randomlyPickedArtists.push(fetchRelatedArt);

        //do analysis on user's top tracks
        //[0] = danceability, [1] = energy, [2] = valence, [3] = tempo, [4] = acousticness
        let audioFeatures = await makeReq({
            url: SPYfetchURL("audioFeatures"), 
            type: "audioFeatures",
            searchTerm: topTracks.join()
        });

        topTracks.splice(5)

        if (arg.mood !== "general") genres.splice(4)

        arg.mood === "general" ? randomlyPickedArtists.splice(5) : randomlyPickedArtists.splice(1)
        //fetch recommendations (in playlist form) based on user's top played analysis, then send the final value to playlist screen component
        let recoms = await makeReq({
            url: SPYfetchURL("playlist"), 
            type: "seedsRecom",
            limit: arg.limit, //how many songs to return. Max 100, min 1
            seeds: {
                seed_artists: randomlyPickedArtists.join(),
                seed_genres: arg.mood === "general" ? undefined : genres.join(),
                seed_tracks: undefined,
                attributes: await this.fetchAttr(arg.mood, audioFeatures)
            }
        }); 
        return recoms 
    }

    createPlayList = async (id, mood) => {
        //function creates an empty playlist in user's account, that then gets filled with songs generated by generatePlayList()
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

