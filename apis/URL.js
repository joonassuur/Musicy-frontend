const SPYURL = (id) => {
    return ({
            artist: {
                related: `https://api.spotify.com/v1/artists/${id}/related-artists`,
                albums: `https://api.spotify.com/v1/artists/${id}/albums`,
                tracks: `https://api.spotify.com/v1/artists/${id}/top-tracks`,
            }, 
            categories: {
                baseURL: 'https://api.spotify.com/v1/browse/categories'
            },
            recommendations: {
                baseURL: 'https://api.spotify.com/v1/recommendations',
                genreSeeds: 'https://api.spotify.com/v1/recommendations/available-genre-seeds'
            },
            search: {
                baseURL:'https://api.spotify.com/v1/search/',
                audioFeatures: 'https://api.spotify.com/v1/audio-features'
            },
            user: {
                topArtists: 'https://api.spotify.com/v1/me/top/artists/',
                topTracks: 'https://api.spotify.com/v1/me/top/tracks/',
                profile: 'https://api.spotify.com/v1/me',
                createPlayList: `https://api.spotify.com/v1/users/${id}/playlists`,
                addToPlayList: `https://api.spotify.com/v1/playlists/${id}/tracks`,
                saveTrack: `https://api.spotify.com/v1/me/tracks/?ids=${id}`
            }
        }
    )
}

const LFMURL = (id) => {
    const KEY = 'b4232355a2295ab443e33a52d8312d8e'
    let user = `&user=${id}&api_key=${KEY}&format=json`
    let artist = `&artist=${id}&api_key=${KEY}&format=json`
    return ({
            artist: {
                related: `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar${artist}`,
                topTags: `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags${artist}`,
                topTracks: `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks${artist}`,
            },
            user: {
                topArtists: `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists${user}`,
                topTags: `https://ws.audioscrobbler.com/2.0/?method=user.gettoptags${user}`,
            }
        }
    )
}

const YTURL = () => {
  const KEY = 'AIzaSyC24RHTh1gX_58mSjR08qdsz4aoXrTZPws'
  return ({
          search: `https://www.googleapis.com/youtube/v3/search?key=${KEY}`,
          video: `https://www.googleapis.com/youtube/v3/videos?key=${KEY}`
      }
  )
}

export const SPYfetchURL = (type, id) => {
    switch (type) {
      case "topArtists":
        return SPYURL().user.topArtists
      case "topTracks":
        return SPYURL().user.topTracks
      case "genreSeeds":
        return SPYURL().recommendations.genreSeeds
      case "rltdArt":
        return SPYURL(id).artist.related
      case "album":
        return SPYURL(id).artist.albums
      case "track":
        return SPYURL(id).artist.tracks
      case "playlist":
        return SPYURL().recommendations.baseURL
      case "search":
        return SPYURL().search.baseURL
      case "audioFeatures":
        return SPYURL().search.audioFeatures
      case "profile":
        return SPYURL().user.profile
      case "createPlayList":
        return SPYURL(id).user.createPlayList
      case "addToPlayList":
        return SPYURL(id).user.addToPlayList
      case "saveTrack":
        return SPYURL(id).user.saveTrack
      default:
        return undefined
    }
}

export const LFMfetchURL = (type, id) => {
    switch (type) {
      case "rltdArt":
        return LFMURL(id).artist.related
      default:
        return undefined
    }
}

export const YTfetchURL = (type) => {
  switch (type) {
    case "search":
      return YTURL().search
    case "video":
      return YTURL().video
    default:
      return undefined
  }
}
