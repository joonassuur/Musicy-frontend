import {rand} from "../methods";

export default LFM = async() => {

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
}

