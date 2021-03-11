
//Code to send data from JavaScript to node.js
const postData = data => {
  const body = JSON.stringify(data);
  return fetch('/play', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body
    })
    .then(response => response.json())
}

let selectedPlayers = [];
let remainingPlayers = 11;
let pointsRemaining = 1000;
let batsmen = 0;
let bowlers = 0;
let allRounders = 0;
let wicketKeepers = 0;


$(".card > button").click(function(e) {

  let removePlayer = "";
  let index = -1;

  //Remove players
  if ($(this).text() !== "+") {
    removePlayer = $(this).attr("value");
    index = selectedPlayers.indexOf(removePlayer);
    if (index != -1) {
      $(this).text("+");
      remainingPlayers += 1;
      $("#pl-remain").text(remainingPlayers);
      pointsRemaining = pointsRemaining + parseFloat($(this).attr("value1"));
      $("#pts-remain").text(pointsRemaining);
      if ($(this).attr("id") === "batsmen") {
        $("#bat").text(batsmen -= 1);
      } else if ($(this).attr("id") === "bowler") {
        $("#ball").text(bowlers -= 1);
      } else if ($(this).attr("id") === "allrounder") {
        $("#ar").text(allRounders -= 1);
      } else {
        $("#wk").text(wicketKeepers -= 1);
      }
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-success");
      selectedPlayers.splice(index, 1);
      return selectedPlayers;
    }
  }

  //Add players
  if (remainingPlayers != 0 && (pointsRemaining - parseFloat($(this).attr("value1"))) > 0) {

    if ($(this).attr("id") === "wicketkeeper" && wicketKeepers >= 1) {
      alert("You can choose only 1 wicket-keeper");
      return selectedPlayers;
    }
    remainingPlayers -= 1;
    selectedPlayers.push($(this).attr("value"));
    $(this).text("x");
    $(this).addClass("btn btn-danger button-select-players");
    $("#pl-remain").text(remainingPlayers);
    pointsRemaining = pointsRemaining - parseFloat($(this).attr("value1"));
    $("#pts-remain").text(pointsRemaining);
    if ($(this).attr("id") === "batsmen") {
      $("#bat").text(batsmen += 1);
    } else if ($(this).attr("id") === "bowler") {
      $("#ball").text(bowlers += 1);
    } else if ($(this).attr("id") === "allrounder") {
      $("#ar").text(allRounders += 1);
    } else{
      $("#wk").text(wicketKeepers += 1);
    }
  } else {
    alert("You can't select more players");
  }

    if(selectedPlayers.length == 11){
      console.log(selectedPlayers);
      //Code to send data from JavaScript to node.js
      postData({
          playersSelected: selectedPlayers
        })
        .then(json => {
          console.log(json);
        })
        .catch(e => console.log(e));
    }

});
