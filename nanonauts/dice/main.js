// JavaScript Dice Game by Coding Commanders 
// Full tutorials at codingcommanders.com/dice
// Tweet me: @codingcommander
// player's score
var score = 0;
// "message" img alt text array
var side_alt = ["roll: 1", "roll: 2", "roll: 3", "roll: 4", "roll: 5", "roll: 6"];
function throwdice(){
  //create a random integer between 1 and 6
  let rand1 = Math.round(Math.random()*5) + 1;
  let rand2 = Math.round(Math.random()*5) + 1;
  let rand3 = Math.round(Math.random()*5) + 1;
  let rand4 = Math.round(Math.random()*5) + 1;

  // Set Image src
  document.getElementById("mydice1").src = "images/d" + rand1 + ".png";
  document.getElementById("mydice2").src = "images/d" + rand2 + ".png";
  document.getElementById("hisdice1").src = "images/e" + rand3 + ".png";
  document.getElementById("hisdice2").src = "images/e" + rand4 + ".png";

  // Set Image alt
  document.getElementById("mydice1").alt = side_alt[rand1];
  document.getElementById("mydice2").alt = side_alt[rand2];
  document.getElementById("hisdice1").alt = side_alt[rand3];
  document.getElementById("hisdice2").alt = side_alt[rand4];


  who_won(rand1,rand2,rand3,rand4);
}

function who_won(rand1,rand2,rand3,rand4){
  let player_points = rand1 + rand2 + 2;
  let enemy_points = rand3 + rand4 + 2;
  let giffy = winner(player_points,enemy_points);
  document.getElementById("message").src = "images/" + giffy;
  document.getElementById("message").alt = giffy;

  // set the value of the score input element to the variable score
  document.getElementById("score").value = score;
}

function winner(player, enemy) {
  if (player < enemy) {
    // subtract a point
    score = score-1;
    return "oof-looser.gif";
  }
  if (enemy < player) {
    // add a point
    score = score + 1;
    return "twerk-win.gif";
  }
  if (player == enemy) {
    return "equal.gif";
  }
}

/* Version 2 Code Here */
// ol element containing high scores
const List=document.getElementById("highscores");
// game submition form
const myform=document.getElementById("myform");
// element displaying error messages
const Errors=document.getElementById("error");

// Function to Reset Score and High Score List
function resetForm () {
  while (List.hasChildNodes()) {
    List.removeChild(List.firstChild);
  }
  get_scores(list_scores);
  document.getElementById("score").value = 0;
  score=0;
}

// code to execute when
const Myform = document.getElementById("myform");
Myform.addEventListener("submit", function (event) {
  // don't reload page
  event.preventDefault();
  var tenth_score = document.getElementById('lowscore').value;

  if (score > tenth_score) {
    document.getElementById("message").src = "images/highscore.gif";
    document.getElementById("message").alt = "You made it on the highscore list!!!";
  }
  else {
    document.getElementById("message").src = "images/good-luck.gif";
    document.getElementById("message").alt = "Good luck chump!";
  }
      //Form Data Object
    var formData = new FormData(this);

    // fetch request
    fetch ("dice.php", {
      method: "post",
      body: formData
    })
    .then (function (response){
      return response.text();
    })
    .then(function(text) {
      resetForm();
      console.log(text);
    })
    .catch(function (err) {
      Errors.innerHTML = err;
    })
});

// Function to get the high score JSON
function get_scores (callback) {
  // High Score Data
  let file = "scores.json";

  // Fetch High Score Data
  fetch(file, {cache: 'no-cache'})
    .then(function(response) {
        //  If the response isn't OK
        if (response.status !== 200) {
          Errors.innerHTML = response.status;
        }
        // If the response is OK
        response.json().then(function(data) {
          let scores = JSON.stringify(data);
          console.log(scores);
          callback (scores);
        });
      })
    // If there is an error
    .catch(function(err) {
      Errors.innerHTML = err;
    });
}

//Function to display high score list
 var list_scores = function (scores) {
  // turn scores JSON to a JavaScript object
  let object = JSON.parse(scores);

  // Store lowest high score for later
  let lowest_score = object[9].score;
  document.getElementById('lowscore').value = lowest_score;

  // loop through high scores
  for (let i=0; i<object.length; i++) {
    // console.log(object[i]);
    let li = document.createElement("LI");
    let text = document.createTextNode(object[i].name + " ... " + object[i].score);
    li.appendChild(text);
    List.appendChild(li);
    if (i===0) {
      li.setAttribute('class',"top1");
    }
    if (i===1) {
      li.setAttribute('class',"top2");
    }
    if (i===2) {
      li.setAttribute('class',"top3");
    }
  }
}