var Spotify = require('node-spotify-api');
// Include the axios npm package
var axios = require("axios");
// code to read and set any environment variables with the dotenv package:
require("dotenv").config();
// import the `keys.js` file and store it in a variable.
var keys = require("./keys.js");
// Access the spotify keys
var spotify = new Spotify(keys.spotify);
// Grabbing what the user wants to do
var command = process.argv[2];
// Grabbing the name of the band/artist/movie that the user wants to know about
var userInput = process.argv[3];

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function emptyObject(object) {
  return (0 === object.length)
}

function concertThis(artistName) {
  var queryURL = ("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
  // Then run a request with axios to the OMDB API with the movie specified
  axios.get(queryURL).then(
    function(response) {

      if (emptyObject(response.data)) {
        console.log("This artist does not have any scheduled concerts")
      }
      else {

        for (var i in response.data) {

          console.log("-----")

          console.log("Name of the venue: " + response.data[i].venue.name);

          console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);

          console.log("Date of the Event: " + response.data[i].datetime);
        }
    }

  })
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);


  });

}

function spotifyThisSong(song) {

  if (isEmpty(song)) {
    song = "The Sign";

    spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    for (var i in data.tracks.items) {
        if(((data.tracks.items[i].artists[0].name) === "Ace of Base") && (((data.tracks.items[i].name) === song))) {
          console.log("-------");
          console.log("Artist: " + data.tracks.items[i].artists[0].name);
          console.log("Song title: " + data.tracks.items[i].name);
          if (isEmpty(data.tracks.items[i].preview_url)) {
            console.log("No preview found");
          }
          else {
            console.log("Preview URL: " + data.tracks.items[i].preview_url);
          }
          console.log("Album name: " + data.tracks.items[i].album.name);
    }
    
  };
  });
  }
  else {
    spotify.search({ type: 'track', query: song }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song title: " + data.tracks.items[0].name);
      if (isEmpty(data.tracks.items[0].preview_url)) {
        console.log("No preview found");
      }
      else {
        console.log("Preview URL: " + data.tracks.items[0].preview_url);
      }
      console.log("Album name: " + data.tracks.items[0].album.name);
      });
  };
}

function movieThis(movieName) {

  var queryURL = ("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
  // Then run a request with axios to the OMDB API with the movie specified
  axios.get(queryURL).then(
    function(response) {
      console.log("-------");
      console.log("Title of the movie: " + response.data.Title);
      console.log("Year the movie came out: " + response.data.Year);
      console.log("IMDB Rating of the movie: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
      console.log("Country where the movie was produced: " + response.data.Country);
      console.log("Language of the movie: " + response.data.Language);
      console.log("Plot of the movie: " + response.data.Plot);
      console.log("Actors in the movie: " + response.data.Actors);
      console.log("-------");
  })
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);

  });

}
// Running a switch that runs the corresponding function depending on the user command.
switch (command) {
    case "concert-this":
        if(isEmpty(userInput)) {
            console.log("Type in an artist name between quotes after typing in 'concert-this'");
            console.log('Example: node liri.js concert-this "Celine Dion"');
        }
        else {
            concertThis(userInput);
        }
        break;
    case "spotify-this-song":
          spotifyThisSong(userInput);
        break;
    case "movie-this":
        if(isEmpty(userInput)) {
            userInput = "Mr. Nobody";
            movieThis(userInput);
        } 
        else {
            movieThis(userInput);
        }
        break;
    case "do-what-it-says":
      console.log("Thursday");
      break;
  }
