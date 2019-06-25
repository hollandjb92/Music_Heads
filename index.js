//CHRIS'S CODE


































































































//GEORGE'S CODE



































































































//JORDAN'S CODE

///ellipses after super long titles....

let spotifyToken = "BQCNwLlqNbwuLgqCLpO6lZbP3jTAMyAk5JedmjNS24gxE0Td8KObkRN4p0WiZeWLDs4I_TgzZJWH5r4ev2fYskjX9xYL_CSyeg1s_BrX6lIqkspoyTlC8CnUL8VmEGSsH48FCqe4vSfGlN2h8FuBOFo6Z4J9_UtN1ly03ec";

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: cb => {
      cb(spotifyToken);
    }
  });


  // Error handling
  player.addListener("initialization_error", ({
    message
  }) => {
    console.error(message);
  });
  player.addListener("authentication_error", ({
    message
  }) => {
    console.error(message);
  });
  player.addListener("account_error", ({
    message
  }) => {
    console.error(message);
  });
  player.addListener("playback_error", ({
    message
  }) => {
    console.error(message);
  });

  // Playback status updates
  player.addListener("player_state_changed", state => {
    console.log(state);
  });

  // Ready
  player.addListener("ready", ({
    device_id
  }) => {
    console.log("Ready with Device ID", device_id);
  });

  // Not Ready
  player.addListener("not_ready", ({
    device_id
  }) => {
    console.log("Device ID has gone offline", device_id);
  });

  $(document).on("click", ".apiPlayTrack", function () {
    let play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play`, {
          method: 'PUT',
          body: JSON.stringify({
            "uris": [spotify_uri]
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + spotifyToken
          },
        });
      });
    };

    play({
      playerInstance: player,
      spotify_uri: 'spotify:track:' + $(this).data("request"),
    });

    $("#track").text($(this).data("track"))
    $("#artist").text($(this).data("artist"))
    $("#albumImage").attr("src", $(this).data("cover"))


    //for displaying lyrics
    artistSearch = $(this).data("artist")
    songSearch = $(this).data("track")

    var apiKey = "apikey=Wf0E7jjJpbuaCL9DKtaw7DNvsh0PqwLI8KX2I9YTn9cuQYiUs0domYZT81FTFewC";
    var queryUrl = "https://orion.apiseeds.com/api/music/lyric/" + artistSearch + "/" + songSearch + "?" + apiKey;
    console.log(queryUrl);


    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      $("#lyrics").append(response.result.track.text);
    })
  });


  //this is for albums
  // $(document).on("click", ".apiPlayAlbum", function () {

  //   let play = ({
  //     playerInstance: {
  //       _options: {
  //         getOAuthToken
  //       }
  //     }
  //   }) => {
  //     getOAuthToken(access_token => {

  //       fetch(`https://api.spotify.com/v1/me/player/play`, {
  //         method: 'PUT',
  //         body: JSON.stringify({
  //           "context_uri": "spotify:album:" + $(this).data("request"),
  //           "offset": {
  //             "position": 0
  //           },
  //           "position_ms": 0
  //         }),
  //         headers: {
  //           "Accept": "application/json",
  //           'Content-Type': 'application/json',
  //           'Authorization': "Bearer " + spotifyToken
  //         },
  //       });
  //     });
  //   };

  //   play({
  //     playerInstance: player,
  //   });
  // });


  // Connect to the player!
  player.connect();

  $(".play").on("click", function () {
    player.resume().then(() => {
      console.log('Resumed!');
    });
  });

  $(".pause").on("click", function () {
    player.pause().then(() => {
      console.log('Paused!');
    });
  });

};


$(document).on("click", "#searchButton", function (event) {
  event.preventDefault();
  let query = $("#searchInput").val().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g, "");
  console.log(query)
  $.ajax({
    type: "GET",
    url: "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=3",
    headers: {
      Authorization: "Bearer " + spotifyToken
    }
  }).done(function (res) {
    console.log(res);

    $("#spotify, #youtube, #lyrics").empty();


    //adding image and buttons
    $("#spotify").append($("<div>").addClass("searchResult").append("<img src='" + res.tracks.items[0].album.images[1].url + "'>")).append($("<button>").addClass("controlButton apiPlayTrack").attr("data-artist", res.tracks.items[0].artists[0].name).attr("data-track", res.tracks.items[0].name).attr("data-cover", res.tracks.items[0].album.images[2].url).attr("data-request", res.tracks.items[0].id).append("<i>").addClass("far fa-play-circle fa-4x")).append($("<button>").addClass("controlButton favouriteButton").append("<i>").addClass("far fa-heart fa-4x"));

    $("#youtube").append($("<div>").addClass("searchResult").append("<img src='" + res.tracks.items[1].album.images[1].url + "'>")).append($("<button>").addClass("controlButton apiPlayTrack").attr("data-artist", res.tracks.items[1].artists[0].name).attr("data-track", res.tracks.items[1].name).attr("data-cover", res.tracks.items[1].album.images[2].url).attr("data-request", res.tracks.items[1].id).append("<i>").addClass("far fa-play-circle fa-4x")).append($("<button>").addClass("controlButton favouriteButton").append("<i>").addClass("far fa-heart fa-4x"));


    $("#lyrics").append($("<div>").addClass("searchResult").append("<img src='" + res.tracks.items[2].album.images[1].url + "'>")).append($("<button>").addClass("controlButton apiPlayTrack").attr("data-artist", res.tracks.items[2].artists[0].name).attr("data-track", res.tracks.items[2].name).attr("data-cover", res.tracks.items[2].album.images[2].url).attr("data-request", res.tracks.items[2].id).append("<i>").addClass("far fa-play-circle fa-4x")).append($("<button>").addClass("controlButton favouriteButton").append("<i>").addClass("far fa-heart fa-4x"));

    //adding song title and artist

    $("#spotify").append("<span class='playTrack'>" + res.tracks.items[0].name + "</span>")
    $("#youtube").append("<span class='playTrack'>" + res.tracks.items[1].name + "</span>")
    $("#lyrics").append("<span class='playTrack'>" + res.tracks.items[2].name + "</span>")


    $("#spotify").append("<span class='playArtist'>" + res.tracks.items[0].artists[0].name + "</span>")
    $("#youtube").append("<span class='playArtist'>" + res.tracks.items[1].artists[0].name + "</span>")
    $("#lyrics").append("<span class='playArtist'>" + res.tracks.items[2].artists[0].name + "</span>")





  })


})