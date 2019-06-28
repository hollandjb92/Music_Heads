//CHRIS'S CODE

//GEORGE'S CODE

//JORDAN'S CODE



let spotifyToken =
  "BQBc-jHvJrvqEsmKQaL2A1YIvQkFfe65hwxNC2Y4hH_l0RRBRya2TmqACO6eaaOvXaI0NqukuqaP8Xs1a4nQ6qpsXwnGKv6WwAaGknGBpLA7lR0qsjijdiAm1yPIyZJRt3odV2Fx4Tpou_4m-w7OV9AuLvtkElfYzxLaAGg";

function isEmpty(element) {
  return !$.trim(element.html());
}



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

    // let duration = $(this).data("duration");
    // duration = parseInt(duration) * 1.35;
    // console.log(duration);

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
    } else if ($(this).parent().parent().attr("id") === "youtube") {
      $("#spotify").empty();
      $(this)
        .parent(".searchResult")
        .removeClass("slideInUp")
        .addClass("slideInRight")
        .appendTo("#spotify");
      $("#youtube, #lyrics").empty();
    } else {
      $("#spotify").empty();
      $(this)
        .parent(".searchResult")
        .removeClass("slideInUp")
        .addClass("slideInRightRight")
        .appendTo("#spotify");
      $("#youtube, #lyrics").empty();
    }

    //for displaying lyrics
    artistSearch = $(this).data("artist");

    songSearch = $(this).data("track").replace(/[.,\/#!$%\"^&\*;:{}=\-_`~()]/g, "");

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
      method: "GET",
      error: function () {
        $("<p id='noLyrics' class='animated jackInTheBox'>").html("NO LYRICS FOUND").appendTo($("#lyrics"));
      }
    }).then(function (response) {

      let lyrics = (response.result.track.text).split("]")
      // .replace(/[(]/g, "$&\n").replace(/[)]/g, "$&\n").replace(/[[]/g, "$&\n").replace(/[/]]/g, "$&\n")

      console.log(lyrics);
      if (isEmpty($("#lyrics"))) {
        $("#lyrics").append(
          $("<div id='lyricResult' class='animated slideInUp'>"));
        lyrics.forEach(function (lyric) {
          lyric = lyric.replace(/[[]/g, " ")
          console.log(lyric)
          $("<p class='displayLyrics'>").html(lyric).appendTo($("#lyricResult"));
        })
      }



      // let myDiv = $("#lyrics");
      // myDiv.animate({
      //   scrollTop: myDiv[0].scrollHeight
      // }, duration)

    });


  });




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

  $("#lyrics").css("max-height", "");
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
        .attr("data-duration", res.tracks.items[0].duration_ms)
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
        .attr("data-duration", res.tracks.items[1].duration_ms)
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
        .attr("data-duration", res.tracks.items[2].duration_ms)
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

$(window).scroll(function () {
  $('#lyrics').css("display", "none");
});

function showRegisterForm() {
  $('.loginBox').fadeOut('fast', function () {
    $('.registerBox').fadeIn('fast');
    $('.login-footer').fadeOut('fast', function () {
      $('.register-footer').fadeIn('fast');
    });
    $('.modal-title').html('Register');
  });
  $('.error').removeClass('alert alert-danger').html('');

}

function showLoginForm() {
  $('#loginModal .registerBox').fadeOut('fast', function () {
    $('.loginBox').fadeIn('fast');
    $('.register-footer').fadeOut('fast', function () {
      $('.login-footer').fadeIn('fast');
    });

    $('.modal-title').html('Login via');
  });
  $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal() {
  showLoginForm();
  setTimeout(function () {
    $('#loginModal').modal('show');
  }, 230);

}

function openRegisterModal() {
  showRegisterForm();
  setTimeout(function () {
    $('#loginModal').modal('show');
  }, 230);

}



function shakeModal() {
  $('#loginModal .modal-dialog').addClass('shake');
  $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
  $('input[type="password"]').val('');
  setTimeout(function () {
    $('#loginModal .modal-dialog').removeClass('shake');
  }, 1000);
}

//FIREBASE USER AUTH

var firebaseConfig = {
  apiKey: "AIzaSyBs4mWHMkPE15ZKuISK7qVN5igCC_vPAO8",
  authDomain: "musicheads-57896.firebaseapp.com",
  databaseURL: "https://musicheads-57896.firebaseio.com",
  projectId: "musicheads-57896",
  storageBucket: "",
  messagingSenderId: "329833828196",
  appId: "1:329833828196:web:429652341533a3a9"
};

firebase.initializeApp(firebaseConfig);

$(document).on("click", ".btn-register", function (event) {
  event.preventDefault();

  let email = $(".registerBox #email").val();
  let password = $(".registerBox #password").val();
  let password2 = $(".registerBox #password_confirmation").val();

  $(".registerBox #email").val("");
  $(".registerBox #password").val("");
  $(".registerBox #password_confirmation").val("");

  if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
    alert("Please Format Email Properly")
  }


  if (password.length < 6) {
    alert("Password must be at least 6 characters")
  } else if (password != password2) {
    alert("Passwords do not match")
    return
  } else {
    alert("Sign Up Successful")
    $('#loginModal').modal('hide');
  }

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
    console.log(user)
    $("#signup").text("Logout").removeAttr("id").attr("id", "logout").removeAttr("onclick");
    $("#login").text(user.user.email).css("width", "auto").removeAttr("id").attr("id", "userProfile").removeAttr("onclick");

  }).catch(function (err) {
    console.log(err)
  })
})

$(document).on("click", ".btn-login", function (event) {
  event.preventDefault();

  let email = $(".loginBox #email").val();
  let password = $(".loginBox #password").val();

  $(".loginBox #email").val("");
  $(".loginBox #password").val("");

  firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
    console.log(user)
  }).catch(function (err) {
    console.log(err)
    shakeModal();
  })

  $('#loginModal').modal('hide');

})

$(document).on("click", "#logout", function (event) {
  event.preventDefault();

  firebase.auth().signOut().then(function () {
    alert("User Signed Out")
    $("#userProfile").text("Login").removeAttr("id").attr("id", "login").attr("onClick", "openLoginModal();").css("width", "150px")
    $("#logout").text("Sign Up").removeAttr("id").attr("id", "signup").attr("onClick", "openRegisterModal();")
  }).catch(function (err) {
    console.log(err)
  })
})