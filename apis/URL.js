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
            search: {
                baseURL:'https://api.spotify.com/v1/search/'
            },
            user: {
                topArtists: 'https://api.spotify.com/v1/me/top/artists/'
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
      case "user":
        return SPYURL().user.topArtists
      case "rltdArt":
        return SPYURL(id).artist.related
      case "album":
        return SPYURL(id).artist.albums
      case "track":
        return SPYURL(id).artist.tracks
      case "search":
        return SPYURL().search.baseURL
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
