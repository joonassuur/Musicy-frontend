import axios from 'axios';

export default (url, term) => {

    axios.get(URL.DZR.artist.baseURL + term + URL.DZR.artist.related)
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