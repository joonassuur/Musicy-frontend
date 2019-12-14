import axios from 'axios';
import {rand} from "../methods";

(LFM = async() => {

    useRes = async (res, type, arr, discoverNew) => {
        let recomArtists = [];

        if (type === "recommendArtist") {
            
            mapRelatedArt = async () => {
                
                res.data.similarartists.artist.map(e=>{
                    let mapUserTop = arr.map(i =>i[0].toLowerCase());
                    //push artists that are not in user's top listens to "recommended array"
                    if (discoverNew) {
                        if (!mapUserTop.includes(e.name.toLowerCase())) {
                            recomArtists.push(e.name)
                        }
                    } else {
                        recomArtists.push(e.name)
                    }
                })
            }
            await mapRelatedArt()
            //pick & return random related artist
            return rand(recomArtists)
        }
    }
})

export const makeLFMreq = async (arg = {}) => {
    LFM() //get protected namespace
    arg = {
        url: arg.url || undefined,
        type: arg.type || undefined,
        arr: arg.arr || undefined,
        discoverNew: arg.discoverNew || true,
    }

    const response = await axios.get(arg.url)
        .then(
            async (res) => {
                return useRes(res, arg.type, arg.arr, arg.discoverNew)
            }
        )
        .catch((error) => {
            console.log("LFM error: " + error);
        })
    
    return response
}
