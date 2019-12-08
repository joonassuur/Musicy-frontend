import axios from 'axios';

useResp = async (res, type) => {
    let recomArtists = []
    if (type === "recommendArtist") {
        mapRelatedArt = async () => {
            res.data.similarartists.artist.map(e=>{
                recomArtists.push(e.name)
            })
        }
        await mapRelatedArt()
        //pick & return random related artist
        return recomArtists[Math.floor(Math.random() * recomArtists.length)]
    }
}

export const makeLFMreq = async (url, type) => {
    
    const response = await axios.get(url)
        .then(
            async (res) => {
                return useResp(res, type)
            }
        )
        .catch((error) => {
            console.log("LFM error: "+error);
        })
    
    return response
}
