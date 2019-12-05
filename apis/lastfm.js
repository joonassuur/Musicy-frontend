import axios from 'axios';

const LFM_KEY = process.env.LFM_KEY;

export default (url, term) => {

    axios.get(URL.LFM.artist.related + term + LFM_KEY)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
}
