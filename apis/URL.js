const SPYURL = (id) => {
    return ({
            artist: {
                related: 'https://api.spotify.com/v1/artists/' + id + 
                '/related-artists',
                albums: 'https://api.spotify.com/v1/artists/' + id + '/albums',
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
    let key = 'b4232355a2295ab443e33a52d8312d8e'
    let userParam = `&user=${id}&api_key=${key}&format=json`
    let artistParam = `&artist=${id}&api_key=${key}&format=json`
    return ({
            artist: {
                related: 'https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar' + artistParam,
                topTags: 'https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags' + artistParam
            },
            user: {
                topArtists: 'https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists' + userParam,
                topTags: 'https://ws.audioscrobbler.com/2.0/?method=user.gettoptags' + userParam
            }
        }
    )
}

export const SPYfetchURL = (type, id) => {
    switch (type) {
      case "user":
        return SPYURL().user.topArtists
      case "relatedArt":
        return SPYURL(id).artist.related
      case "album":
        return SPYURL(id).artist.albums
      default:
        return undefined
    }
}

export const LFMfetchURL = (type, id) => {
    switch (type) {
      case "relatedArt":
        return LFMURL(id).artist.related
      default:
        return undefined
    }
}
