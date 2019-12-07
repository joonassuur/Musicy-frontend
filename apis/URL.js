export default URL = (id) => {

    return ({
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
                    relatedArt: 'https://api.spotify.com/v1/artists/' + id + 
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
            },
            DZR: {
                artist: {
                    baseURL: 'https://api.deezer.com/artist/' + id,
                    related: '/related'
                },
                genre: {
                    baseURL: 'https://api.deezer.com/genre/',
                    artists: '/artists'
                }
            }  
        }
    )
}
