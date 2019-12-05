export default URL = {

    LFM: {
        artist: {
            related: 'https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&format=json&artist=',
            topTracks: 'https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&format=json&artist='
        },
        tag: {
            topArtists: 'https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&format=json&tag='
        }
    },
    SPY: {
        artist: {
            baseURL: 'https://api.spotify.com/v1/artists/', // + {ID} + ...
            related: '/related-artists',
            topTracks: '/top-tracks'
        },
        categories: {
            baseURL: 'https://api.spotify.com/v1/browse/categories'
        },
        search: {
            baseURL:'https://api.spotify.com/v1/search/'
        },
        user: {
            topArtists: 'https://api.spotify.com/v1/me/top/artists/' // + {ID}
        }
    },
    DZR: {
        artist: {
            baseURL: 'https://api.deezer.com/artist/', // + {ID} + ...
            related: '/related'
        },
        genre: {
            baseURL: 'https://api.deezer.com/genre/',
            artists: '/artists'
        }
    }  
}
