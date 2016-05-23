var Observable = require('FuseJS/Observable');
var shows = Observable();

getShowsList(shows);

module.exports = {
    shows: shows,
};

function getShowsList(shows) {
    fetch('http://www.mocky.io/v2/5742ae1f0f00008715a576dc')
    .then(
         function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function(data) {
                var keys = Object.keys(data.data);
                return Promise.all(
                    keys.map(function(key) {return getFanart(data.data[key]);})
                );
            }).then(function(showsList) {
                console.log(JSON.stringify(showsList));
                showsList.forEach(function(show) {
                    shows.add(show);
                });
            })
        })
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}

function getFanart(show) {
  return fetch('https://webservice.fanart.tv/v3/tv/' + show.indexerid + '?api_key=865946a302a802eccf3bbd1c218b496e')
    .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      return response.json().then(function(json) {
        if(json.hasOwnProperty('tvthumb')) {
            show.fanart = json.tvthumb[0].url;
        } else {
              show.fanart = '';
        }
        console.log(show.fanart);
        return show;
      });
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}
