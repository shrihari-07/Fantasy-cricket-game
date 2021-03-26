# Fantasy-cricket-game
An online game similar to Dream11. Users need to select 11 players from 2 real time cricket teams and score for the users is calculated based on the real time performance of the cricket players. There is a score calculation formula that is used to convert the player's performance into score. Finally the users are placed on the leaderboard in the descending order of the score that they gain.
The front-end of the website is being developed using HTML, CSS, Bootstrap, JavaScript,jQuery, ejs and the back-end is developed using node.js, MySql.
## Rules to play
### Batting
* 1 point for 2 runs scored
* Additional 5 points for half century
* Additional 10 points for century
* 2 points for strike rate (runs/balls faced) of 80-100
* Additional 4 points for strike rate>100
* 1 point for hitting a boundary (four) and 2 points for over boundary (six)

### Bowling
* 10 points for each wicket
* Additional 5 points for three wickets per innings
* Additional 10 points for 5 wickets or more in innings
* 4 points for economy rate (runs given per over) between 3.5 and 4.5
* 7 points for economy rate between 2 and 3.5
* 10 points for economy rate less than 2

### Fielding
* 10 points each for catch/stumping/run out
