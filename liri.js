const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
var inquirer = require("inquirer");
var request = require("request");
var fs = require('fs');


const TwitterAuth = new Twitter(keys.twitterKeys);
const SpotifyAuth = new Spotify(keys.spotifyKeys);

const command = process.argv[2];

var params = {
    screen_name: "krekeltjekip",
    count: 20
};

//my-tweets command

if (command == "my-tweets") {
    console.log("Retrieving @krekeltjekip's last 20 tweets!");

    TwitterAuth.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            for (i = 0; i < tweets.length; i++) {
                var individTweet = tweets[i];
                var text = JSON.stringify(individTweet.text);
                var timestamp = JSON.stringify(individTweet.created_at + " UTC");
                var tweetNum = i + 1;
                console.log("Tweet # " + tweetNum + " of 20 most recent tweets: " +
                    text + " tweeted on " + timestamp);
            }
        } else {
            console.log('Error occurred: ' + error);
        }

    });
}

//spotify-this-song command

if (command == "spotify-this-song") {
    inquirer.prompt([{
        type: "input",
        name: "song",
        message: "What song are you looking for?"
    }, ]).then(function (question) {
        var songChoice = question.song;

        if (songChoice == "") {
            SpotifyAuth.search({
                type: 'track',
                query: 'The Sign',
                limit: 10
            }, function (error, data) {
                if (!error) {
                    console.log("Artist(s): " + data.tracks.items[8].artists[0].name + "\nSong: " +
                        data.tracks.items[8].name + "\nPreview: " + data.tracks.items[8].external_urls.spotify +
                        "\nAlbum: " + data.tracks.items[8].album.name);
                } else {
                    console.log('Error occurred: ' + error);
                }
            });
        } else {
            SpotifyAuth.search({
                type: 'track',
                query: songChoice,
                limit: 1
            }, function (error, data) {
                if (!error) {
                    console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\nSong: " +
                        data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify +
                        "\nAlbum: " + data.tracks.items[0].album.name);
                } else {
                    console.log('Error occurred: ' + error);
                }
            });
        }
    });
}

// movie-this command

if (command == "movie-this") {
    inquirer.prompt([{
        type: "input",
        name: "movie",
        message: "What movie are you looking for?"
    }, ]).then(function (question) {
        var movieChoice = question.movie;

        if (movieChoice == "") {
            movieChoice = "Mr.Nobody";
            var movieSearch = "http://www.omdbapi.com/?t=" + movieChoice + "&apikey=40e9cece";
            console.log(movieSearch);
            request(movieSearch, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    console.log("Title: " + (JSON.parse(body).Title) + "\nYear Released: " +
                        (JSON.parse(body).Year) + "\nIMDB Rating: " + (JSON.parse(body).imdbRating) +
                        "\nRotten Tomatoes Rating: " + (JSON.parse(body).Ratings[1].Value) +
                        "\nCountry Produced: " + JSON.parse(body).Country + "\nLanguage: " +
                        (JSON.parse(body).Language) + "\nPlot: " + (JSON.parse(body).Plot) +
                        "\nActors: " + (JSON.parse(body).Actors));
                } else {
                    console.log('Error occurred: ' + error);
                }
            });
        } else {
            movieSearch = "http://www.omdbapi.com/?t=" + movieChoice + "&apikey=40e9cece";
            request(movieSearch, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    console.log("Title: " + (JSON.parse(body).Title) + "\nYear Released: " +
                        (JSON.parse(body).Year) + "\nIMDB Rating: " + (JSON.parse(body).imdbRating) +
                        "\nRotten Tomatoes Rating: " + (JSON.parse(body).Ratings[1].Value) +
                        "\nCountry Produced: " + JSON.parse(body).Country + "\nLanguage: " +
                        (JSON.parse(body).Language) + "\nPlot: " + (JSON.parse(body).Plot) +
                        "\nActors: " + (JSON.parse(body).Actors));
                } else {
                    console.log('Error occurred: ' + error);
                }
            });
        }
    });
}

// do-what-it-says command

if (command == "do-what-it-says") {
    fs.readFile('random.txt', 'utf-8', function (error, data) {
        if (!error) {
            var randomText = data.split(',');
            var randomCommand = randomText[0];
            var randomSong = randomText[1];

            if (randomCommand == "spotify-this-song") {
                SpotifyAuth.search({
                    type: 'track',
                    query: randomSong,
                    limit: 1
                }, function (error, data) {
                    if (!error) {
                        console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\nSong: " +
                            data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify +
                            "\nAlbum: " + data.tracks.items[0].album.name);
                    } else {
                        console.log('Error occurred: ' + error);
                    }
                });
            } else {
                console.log("What do you want me to do here?..");
            }
        } else {
            console.log('Error occurred: ' + error);
        }
    });
}