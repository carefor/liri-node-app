const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const inquirer = require("inquirer");
const request = require("request");
const fs = require("fs");

const TwitterAuth = new Twitter(keys.twitterKeys);
const SpotifyAuth = new Spotify(keys.spotifyKeys);

var liriCommand = process.argv[2];

var params = {};
var songChoice;
var movieRes;

// The switch statement will direct which function is run
switch (liriCommand) {
    case "my-tweets":
    case "tweet":
        myTweets();
        appendCommand();
        break;

    case "spotify-this-song":
    case "spotify":
        spotifyThisSong();
        appendCommand();
        break;

    case "movie-this":
    case "movie":
        movieThis();
        appendCommand();
        break;

    case "do-what-it-says":
    case "do":
        doWhatItSays();
        appendCommand();
        break;
}

//append to log.txt *bonus*
function appendCommand() {
    fs.appendFile("log.txt", liriCommand + "\n", function (err) {
        if (err) {
            console.log("Error occurred: " + err);
        }
    });
}

//my-tweets liriCommand
function myTweets() {
    console.log("Retrieving @krekeltjekip's last 20 tweets!");
    params = {
        screen_name: "krekeltjekip",
        count: 20
    };
    TwitterAuth.get("statuses/user_timeline", params, function (err, tweets, response) {
        if (err) {
            console.log("Error occurred: " + err);
        }
        for (i = 0; i < tweets.length; i++) {
            var tweetText = JSON.stringify(tweets[i].text);
            var timestamp = tweets[i].created_at.substring(4, 19) + " UTC";
            console.log("Tweet #" + (i + 1) + " of 20 most recent tweets: " +
                tweetText + " tweeted on " + timestamp);
        }
    });
}

//spotify-this-song liriCommand
function spotifyThisSong() {
    console.log("Your wish is my liriCommand!");

    inquirer.prompt([{
        type: "input",
        name: "song",
        message: "What song are you looking for?"
    }, ]).then(function (question) {
        var songChoice = question.song;

        if (songChoice == "") {
            params = {
                type: "track",
                query: "The Sign",
                limit: 10
            };
            SpotifyAuth.search(params, function (err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                }
                console.log("Artist(s): " + data.tracks.items[8].artists[0].name + "\nSong: " +
                    data.tracks.items[8].name + "\nPreview: " + data.tracks.items[8].external_urls.spotify +
                    "\nAlbum: " + data.tracks.items[8].album.name);
            });
        } else {
            params = {
                type: "track",
                query: songChoice,
                limit: 1
            };
            SpotifyAuth.search(params, function (err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                }
                console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\nSong: " +
                    data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify +
                    "\nAlbum: " + data.tracks.items[0].album.name);
            });
        }
    });
}

// movie-this liriCommand
function movieThis() {
    console.log("Movie info comin right up!");

    inquirer.prompt([{
        type: "input",
        name: "movie",
        message: "What movie are you looking for?"
    }, ]).then(function (question) {
        var movieChoice = question.movie;

        if (movieChoice == "") {
            movieChoice = "Mr.Nobody";
            var movieSearch = "http://www.omdbapi.com/?t=" + movieChoice + "&apikey=40e9cece";
            request(movieSearch, function (err, response, body) {
                if (err || response.statusCode !== 200) {
                    console.log("Error occurred: " + err);
                }
                movieRes = JSON.parse(body);
                console.log("Title: " + (movieRes.Title) + "\nYear Released: " +
                    (movieRes.Year) + "\nIMDB Rating: " + (movieRes.imdbRating) +
                    "\nRotten Tomatoes Rating: " + (movieRes.Ratings[1].Value) +
                    "\nCountry Produced: " + movieRes.Country + "\nLanguage: " +
                    (movieRes.Language) + "\nPlot: " + (movieRes.Plot) +
                    "\nActors: " + (movieRes.Actors));
            });
        } else {
            movieSearch = "http://www.omdbapi.com/?t=" + movieChoice + "&apikey=40e9cece";
            request(movieSearch, function (err, response, body) {
                if (err || response.statusCode !== 200) {
                    console.log("Error occurred: " + err);
                }
                movieRes = JSON.parse(body);
                console.log("Title: " + (movieRes.Title) + "\nYear Released: " +
                    (movieRes.Year) + "\nIMDB Rating: " + (movieRes.imdbRating) +
                    "\nRotten Tomatoes Rating: " + (movieRes.Ratings[1].Value) +
                    "\nCountry Produced: " + movieRes.Country + "\nLanguage: " +
                    (movieRes.Language) + "\nPlot: " + (movieRes.Plot) +
                    "\nActors: " + (movieRes.Actors));
            });
        }
    });
}

// do-what-it-says liriCommand
function doWhatItSays() {
    console.log("Let's see what's happening in the 'random' file!");

    fs.readFile("random.txt", "utf-8", function (err, data) {
        var randomText = data.split(",");
        liriCommand = randomText[0];

        switch (liriCommand) {
            case "my-tweets":
            case "tweet":
                myTweets();
                break;

            case "spotify-this-song":
            case "spotify":
                songChoice = randomText[1];
                SpotifyAuth.search({
                    type: "track",
                    query: songChoice,
                    limit: 1
                }, function (err, data) {
                    if (err) {
                        console.log("Error occurred: " + err);
                    }
                    console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\nSong: " +
                        data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify +
                        "\nAlbum: " + data.tracks.items[0].album.name);
                });
                appendCommand();
                break;

            case "movie-this":
            case "movie":
                movieChoice = randomText[1];
                console.log("movieChoice is " + movieChoice);
                movieSearch = "http://www.omdbapi.com/?t=" + movieChoice + "&apikey=40e9cece";
                request(movieSearch, function (err, response, body) {
                    if (err || response.statusCode !== 200) {
                        console.log("Error occurred: " + err);
                    }
                    movieRes = JSON.parse(body);
                    console.log("Title: " + (movieRes.Title) + "\nYear Released: " +
                        (movieRes.Year) + "\nIMDB Rating: " + (movieRes.imdbRating) +
                        "\nRotten Tomatoes Rating: " + (movieRes.Ratings[1].Value) +
                        "\nCountry Produced: " + movieRes.Country + "\nLanguage: " +
                        (movieRes.Language) + "\nPlot: " + (movieRes.Plot) +
                        "\nActors: " + (movieRes.Actors));
                });
                appendCommand();
                break;
        }

    });
}