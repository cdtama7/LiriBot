// Include the fs npm package
var fs = require("fs");
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
var userInput = process.argv.slice(3).join(" ");

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function emptyObject(object) {
  return (0 === object.length)
}

var divider = "\n------------------------------------------------------------\n\n";

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
  // fs.appendFile("log.txt", movieData + divider, function(err) {
  //   if (err) throw err;
  //   console.log("------")
  //   console.log(movieData);
  //   console.log("------")
  // });
}

function movieThis(movieName) {

  var queryURL = ("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
  // Then run a request with axios to the OMDB API with the movie specified
  axios.get(queryURL).then(
    function(response) {
      var movieData = [
        "Title of the movie: " + response.data.Title,
        "Year the movie came out: " + response.data.Year,
        "IMDB Rating of the movie: " + response.data.imdbRating,
        "Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value,
        "Country where the movie was produced: " + response.data.Country,
        "Language of the movie: " + response.data.Language,
        "Plot of the movie: " + response.data.Plot,
        "Actors in the movie: " + response.data.Actors,
      ].join("\n\n");
      
      fs.appendFile("log.txt", movieData + divider, function(err) {
        if (err) throw err;
        console.log("------")
        console.log(movieData);
        console.log("------")
      });
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

function itSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    lenght = dataArr.length;

    var rand = dataArr[Math.floor(Math.random() * dataArr.length)];

    var solution = fruit => fruit === rand;

    var found = dataArr.findIndex(solution);

    var userInput2 = dataArr[found + 1];

    if(isEmpty(userInput2)) {
      itSays();
    }
    // console.log(lenght);
    else {
      userInput = userInput2.trim();

      command = rand.trim();
      switch (command) {
        case "concert-this":
              console.log(command + ": " + userInput)
              concertThis(userInput);
            break;
        case "spotify-this-song":
              console.log(command + ": " + userInput)
              spotifyThisSong(userInput);
            break;
        case "movie-this":
              console.log(command + ": " + userInput)
              movieThis(userInput);
            break;
        default:
          itSays();
          break; 
        }
    }
  
    // for (var i in dataArr) {

    //   console.log(dataArr[i].trim());
    // }
    // We will then re-display the content as an array for later use.
    
  
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
      itSays();
      break;
  }
