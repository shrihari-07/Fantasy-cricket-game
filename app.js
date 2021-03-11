const express = require("express");
const bodyParser = require("body-parser");
const mySql = require("mySql");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

app.use(session({ cookie: {maxAge: 60000},
secret: 'woot', resave: false, saveUninitialized: false}));
app.use(express.static("public"));
app.use(express.json());
app.use(flash());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: *****,
  database: "fantasyCricketDB",
  port: *****
});

connection.connect(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

let selectedPlayers = [];
let userName = "";
let teamName = "";
let score = 0;
let evaluateScore = {
  team: teamName,
  points: score
};
let evaluateScoreArray = [];
let signUpPassword = "";
let signUpUserName = "";
let signUpEmail = "";
let signedUp = 0;
let signUpCount = 0;
let count1 = 0;
let loginCount = 0;
let loginSuccess = 0;
let teamCreation = 0;

app.get("/index", function(req, res) {
  res.render("index",{signedUp: signedUp});
  console.log(signedUp);
  signedUp = 0;
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  let loginEmail = req.body.loginEmail;
  let loginPassword = req.body.loginPassword;
  console.log(loginEmail);
  console.log(loginPassword);
  let loginValidation = "SELECT PASSWORD FROM USERS WHERE EMAIL_ID=?;";
  connection.query(loginValidation, [loginEmail], function(err, result){
    if (err){
      console.log(err);
    } else{
      if(loginPassword == result[0].PASSWORD){
        loginCount = 1;
        console.log("Logged in successfully");
        loginCount += 1;
        res.redirect("/index");
      } else{
        console.log("Not ok bro");
        res.redirect("login");
      }
    }
  });
});

app.get("/", function(req, res){
  res.render("signUp");
  count1 = 0;
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/play", function(req, res) {
  res.render("PlayGame");
});

app.post("/play", function(req, res) {
  if(signUpCount === 0){
    if(req.body.signUpEmail != undefined){
      signUpEmail = req.body.signUpEmail;
    }
    if(req.body.signUpUserName != undefined){
      signUpUserName = req.body.signUpUserName;
    }
    if(req.body.signUpPassword != undefined){
      signUpPassword = req.body.signUpPassword;
    }
    console.log("Email: "+signUpEmail);
    console.log("UserName: "+signUpUserName);
    console.log("Password: "+signUpPassword);
    signedUp = 1;
    let signUpUser = "INSERT INTO USERS(USERNAME, EMAIL_ID, PASSWORD) VALUES(?,?,?);";
    count1 = 0;
    connection.query(signUpUser, [signUpUserName, signUpEmail, signUpPassword], function(err, results){
      if(err){
        console.log(err);
      } else{
        console.log("sucess");
      }
    });
    signUpCount += 1;
    res.redirect("/index");
  }

  if (req.body.userName != undefined) {
    userName = req.body.userName;
  }
  if (req.body.teamName != undefined) {
    teamName = req.body.teamName;
    req.flash('TEAMNAME', teamName);
    teamCreation += 2;
  }
  if(loginCount === 0){
    res.redirect("/login");
  } else if(teamCreation === 0){
    teamCreation += 2;
  }
  console.log(userName);
  console.log(teamName);
  if (req.body.playersSelected != undefined) {
    selectedPlayers = req.body.playersSelected;
    req.flash('SELECTEDPLAYERS', selectedPlayers);
  }
  console.log(selectedPlayers);
  console.log("LoginCount is: "+loginCount);
  console.log("Team creation count is: "+teamCreation);

  if (userName != undefined && teamName != undefined && loginCount != 0 && (teamCreation === 4)) {
    // Insertion into TEAM table
    let insertTeam = "INSERT INTO TEAM(TEAM_NAME, SCORE, PLAYER_NAME) VALUES(?, ?, ?);"
    for (var i = 0; i < selectedPlayers.length; i++) {
      connection.query(insertTeam, [teamName, 0, selectedPlayers[i]], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("1 record inserted into TEAM");
        }
      });
    }

    // Insertion into USERS table
    let insertUser = "UPDATE USERS SET TEAM_NAME=? WHERE EMAIL_ID=?;";
    connection.query(insertUser, [teamName, signUpEmail], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("1 record inserted into USERS");
      }
    });

    userName = "";
    teamName = "";
    loginCount = 0;
    signUpCount = 0;
    teamCreation = 0;
    res.redirect("/evaluate");
  }
});

app.get("/evaluate", function(req, res) {

  // Selection from TEAM table
  let okSelectTeam = "SELECT TEAM_NAME FROM TEAM GROUP BY TEAM_NAME;";
  connection.query(okSelectTeam, function(err, results){
    if (err){
      console.log(err);
    } else{
      for (var i = 0; i < results.length;i++){
        let team = results[i].TEAM_NAME;
        // Selection from TEAM table
        let selectTeamPlayer = "SELECT PLAYER_NAME FROM TEAM WHERE TEAM_NAME=?;";
        connection.query(selectTeamPlayer,[team], function(err, results){
          if (err){
            console.log(err);
          } else{
            let count = 0;
            let wicketCount = 0;
            let strikeRate = 0;
            let economy = 0;
            for (var i=0; i<results.length; i++){
              // Selection from INDIVIDUAL_SCORE table
              let player =  results[i].PLAYER_NAME;
              let selectStats = "SELECT RUNS, FACED, FOURS, SIXES, BOWLED, GIVEN, WICKETS FROM INDIVIDUAL_SCORE WHERE PLAYER_NAME=?;";
              connection.query(selectStats, [player], function(err, row, field) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Player: "+player);

                  let runs = row[0].RUNS;
                  let faced = row[0].FACED;
                  let fours = row[0].FOURS;
                  let sixes = row[0].SIXES;
                  let bowled = row[0].BOWLED;
                  let given = row[0].GIVEN;
                  let wickets = row[0].WICKETS;
                  wicketCount += wickets;

                  // Strike Rate calculation
                  if (faced != 0) {
                    strikeRate = runs / faced;
                  } else {
                    strikeRate = 0;
                  }

                  // 1 point for 2 runs
                  score += runs / 2;

                  // 5 points for half-century
                  if (runs >= 50) {
                    score += 5;
                  }
                  // 10 points for century
                  if (runs >= 100) {
                    score += 10;
                  }
                  // 2 points for strike-rate 80-100
                  if (strikeRate >= 80 && strikeRate <= 100) {
                    score += 2;
                  }
                  // 4 points for strike-rate >100
                  if (strikeRate > 100) {
                    score += 4;
                  }
                  // 1 point for boundary
                  if (fours > 0) {
                    score += (fours);
                  }
                  // 2 points for over-boundary
                  if (sixes > 0) {
                    score += (sixes * 2);
                  }

                  // 10 points for each wicket
                  score += (wickets * 10);
                  // economy calculation
                  if (bowled != 0) {
                    economy = given / bowled;
                  } else {
                    economy = 0;
                  }
                  // 4 points for economy rate between 3.5 and 4.5
                  if (economy > 3.5 && economy <= 4.5) {
                    score += 4;
                  }
                  // 7 points for economy rate between 2 and 3.5
                  if (economy > 2 && economy <= 3.5) {
                    score += 7;
                  }
                  // 10 points for economy rate less than 2
                  if (economy <= 2) {
                    score += 10;
                  }
                  count += 1;
                  // console.log("Count is: " + count);
                  if (count === 11) {
                    // 5 points for three wickets per innings
                    if (wicketCount >= 3) {
                      score += 5;
                    }
                    // 10 points for 5 wickets or more per innings
                    if (wicketCount >= 5) {
                      score += 10;
                    }
                    console.log("Your score is: " + score);
                    console.log("Team name: " + team);

                    // Stored procedure to update SCORE row in TEAM table
                    let storedProcedure = "CALL updateTeamScore(?, ?);";
                    connection.query(storedProcedure, [score, team], function(err, results1) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(results1);
                      }
                    });
                    score = 0;
                    count = 0;
                    wicketCount = 0;
                    economy = 0;
                    strikeRate = 0;
                  }
                }
              });

            }
          }
        });

      }
    }
  });


  let selectTeam = "SELECT TEAM_NAME, SCORE FROM TEAM ORDER BY SCORE DESC;";
  connection.query(selectTeam, function(err, results) {
    if (err) {
      console.log(err)
    } else {
      res.render("evaluateScore", {
        results: results
      });
    }
  });

});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Listening on port 3000");
});
