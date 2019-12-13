import axios from 'axios';
import {rand, log} from "../methods";

(useRes = (res, type) => {
    let videos = [],
        embedVideo = []

    if (type === "embed") {
        res.data.items.map(e=>embedVideo.push(e.player.embedHtml))
        return embedVideo; 
    } else {
        res.data.items.map(e=> {
            videos.push(e.id.videoId, e.snippet.title)
        })
        return videos;
    }
})

export const makeYTreq = async (arg = {}) => {
    useRes()
    arg = {
        url: arg.url,
        type: arg.type || undefined,
        q: arg.q || undefined,
        part: arg.part || "snippet",
        id: arg.id || undefined
    }

    const response = await axios.get(arg.url,
        {
            headers: {
                Accept: "application/json"
            },
            params: {
                maxResults: 1,
                q: arg.q,
                part: arg.part,
                id: arg.id
            }
        })
        .then(
            async (res) => {
                return useRes(res, arg.type)
            }
        )
        .catch((error) => {
            log("youtube error: " + error);
        })
    
    return response
}
