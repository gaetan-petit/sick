var Observable = require('FuseJS/Observable');
var showsList = Observable();
var shows = Observable();

function getShows(args) {
    console.log('load shows');
    filterShows(args.sort);
}

getShowsList();
//filterShows(showsList, shows, 'default');
shows = showsList;

module.exports = {
    showsList: showsList,
    shows: shows,
    getShows: getShows,
};

function getShowsList() {
    fetch('http://www.mocky.io/v2/5749c1122700005b193735dc')
    .then(
         function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }
            response.json().then(function(data) {
                var keys = Object.keys(data.data);
                keys.forEach(function(key) {
                    showsList.add(data.data[key]);
                    getFanart(data.data[key]);
                });
            })
        })
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}

function filterShows(sort) {
    console.log(showsList.length);
    var filtered = showsList;
    var filtered = showsList.map(function(item) {
        return item;
    });
    shows.refreshAll(filtered);
}

function getFanart(show) {
  var originalShow = show;
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
        } else if(json.hasOwnProperty('hdtvlogo')) {
            show.fanart = json.hdtvlogo[0].url;
        } else {
            show.fanart = '';
        }
        if(shows.contains(originalShow)) {
            showsList.replaceAt(showsList.indexOf(originalShow), show);
        }
      });
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}
