//CHRIS'S CODE

//GEORGE'S CODE

//JORDAN'S CODE

//move divs to proper locations
//animate.css  - make animation happen for playing bar upon every click
//make background not change - because lyrics take up too much space

let spotifyToken =
  "BQAkwusq129yjvtyglg2yhbKUgRf6oPnEGJVJNDDomHM0QymJoOB0Cqx_URSFV4-XCOGJSr0al_TBjWBm46ajBlKtosQV6kuoB1DYHLGxLObtPOp6x4cQCvu3iw2lbF_VgbY8n4zw1cLY1yOH88CDCzdDt3MEB72HMHTD2I";

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
          method: "PUT",
          body: JSON.stringify({
            uris: [spotify_uri]
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotifyToken
          }
        });
      });
    };

    play({
      playerInstance: player,
      spotify_uri: "spotify:track:" + $(this).data("request")
    });

    let playerTrack = $(this).data("track");

    if (playerTrack.length > 25) {
      playerTrack = playerTrack.substring(0, 25) + "...";
    } else {
      playerTrack === playerTrack;
    }

    $("#lyrics").css("max-height", "500px");

    $("#track")
      .addClass("animated  slow fadeIn")
      .text(playerTrack);
    $("#artist")
      .addClass("animated  slow fadeIn")
      .text($(this).data("artist"));
    $("#albumImage")
      .addClass("animated  fadeInUp")
      .attr("src", $(this).data("cover"));

    if (
      $(this)
      .parent()
      .parent()
      .attr("id") === "spotify"
    ) {
      $(this)
        .parent()
        .parent()
        .removeClass("animated slideInUp");
      $("#youtube, #lyrics").empty();
    } else {
      $("#spotify").empty();
      $(this)
        .parent(".searchResult")
        .removeClass("slideInUp")
        .addClass("slideInRight")
        .appendTo("#spotify");
      $("#youtube, #lyrics").empty();
    }

    //for displaying lyrics
    artistSearch = $(this).data("artist");

    songSearch = $(this).data("track");

    var apiKey =
      "apikey=Wf0E7jjJpbuaCL9DKtaw7DNvsh0PqwLI8KX2I9YTn9cuQYiUs0domYZT81FTFewC";
    var queryUrl =
      "https://orion.apiseeds.com/api/music/lyric/" +
      artistSearch +
      "/" +
      songSearch +
      "?" +
      apiKey;
    console.log(queryUrl);

    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      if (isEmpty($("#lyrics"))) {
        $("#lyrics").append(
          $("<div id='lyricResult' class='animated slideInUp'>").append(
            "<span class='displayLyrics'>" +
            response.result.track.text +
            "</span>"
          )
        );
      }
    });
  });

  function isEmpty(element) {
    return !$.trim(element.html());
  }

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
      console.log("Resumed!");
    });
  });

  $(".pause").on("click", function () {
    player.pause().then(() => {
      console.log("Paused!");
    });
  });
};

$(document).on("click", "#searchButton", function (event) {
  event.preventDefault();
  let query = $("#searchInput")
    .val()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g, "");
  $("#searchInput").val("");
  console.log(query);
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
    $("#spotify").append(
      $("<div>")
      .addClass("searchResult animated slideInUp")
      .append("<img src='" + res.tracks.items[0].album.images[1].url + "'>")
      .append(
        $("<button>")
        .addClass("controlButton apiPlayTrack")
        .attr("data-artist", res.tracks.items[0].artists[0].name)
        .attr("data-track", res.tracks.items[0].name)
        .attr("data-cover", res.tracks.items[0].album.images[2].url)
        .attr("data-request", res.tracks.items[0].id)
        .append("<i>")
        .addClass("far fa-play-circle fa-4x")
      )
      .append(
        $("<button>")
        .addClass("controlButton favouriteButton")
        .append("<i>")
        .addClass("far fa-heart fa-4x")
      )
      .append(
        "<span class='playTrack'>" + res.tracks.items[0].name + "</span>"
      )
      .append(
        "<span class='playArtist'>" +
        res.tracks.items[0].artists[0].name +
        "</span>"
      )
    );

    $("#youtube").append(
      $("<div>")
      .addClass("searchResult animated slideInUp")
      .append("<img src='" + res.tracks.items[1].album.images[1].url + "'>")
      .append(
        $("<button>")
        .addClass("controlButton apiPlayTrack")
        .attr("data-artist", res.tracks.items[1].artists[0].name)
        .attr("data-track", res.tracks.items[1].name)
        .attr("data-cover", res.tracks.items[1].album.images[2].url)
        .attr("data-request", res.tracks.items[1].id)
        .append("<i>")
        .addClass("far fa-play-circle fa-4x")
      )
      .append(
        $("<button>")
        .addClass("controlButton favouriteButton")
        .append("<i>")
        .addClass("far fa-heart fa-4x")
      )
      .append(
        "<span class='playTrack'>" + res.tracks.items[1].name + "</span>"
      )
      .append(
        "<span class='playArtist'>" +
        res.tracks.items[1].artists[0].name +
        "</span>"
      )
    );

    $("#lyrics").append(
      $("<div>")
      .addClass("searchResult animated slideInUp")
      .append("<img src='" + res.tracks.items[2].album.images[1].url + "'>")
      .append(
        $("<button>")
        .addClass("controlButton apiPlayTrack")
        .attr("data-artist", res.tracks.items[2].artists[0].name)
        .attr("data-track", res.tracks.items[2].name)
        .attr("data-cover", res.tracks.items[2].album.images[2].url)
        .attr("data-request", res.tracks.items[2].id)
        .append("<i>")
        .addClass("far fa-play-circle fa-4x")
      )
      .append(
        $("<button>")
        .addClass("controlButton favouriteButton")
        .append("<i>")
        .addClass("far fa-heart fa-4x")
      )
      .append(
        "<span class='playTrack'>" + res.tracks.items[2].name + "</span>"
      )
      .append(
        "<span class='playArtist'>" +
        res.tracks.items[2].artists[0].name +
        "</span>"
      )
    );
  });
});