import axios from 'axios';

useRes = async (res, type) => {
    let recomArtists = []
    if (type === "recommendArtist") {
        mapRelatedArt = async () => {
            res.data.artists.map( e=> {
                recomArtists.push([e.name, e.id])
            })  
        }
        await mapRelatedArt()
        //pick & return random related artist
        return recomArtists
        //return recomArtists[Math.floor(Math.random() * recomArtists.length)]
    }
}

export const makeLFMreq = async (url, type) => {
    
    const response = await axios.get(url)
        .then(
            async (res) => {
                return useRes(res, type)
            }
        )
        .catch((error) => {
            console.log(error);
        })
    
    return response
}
