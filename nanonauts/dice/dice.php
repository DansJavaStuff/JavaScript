<?php
  // myform data
  $player_name = filter_var($_POST[player_name], FILTER_SANITIZE_STRING);
  $player_score = (int)$_POST[player_score];

  // associative array
  $player_array = array("name"=>$player_name, "score"=>$player_score);

  // read scores.JSON and turn into a PHP associative array
  $highscoreJSON = file_get_contents("scores.json");
  $highscore_array = json_decode($highscoreJSON, true);

  // Declare variables
  $key = 0;
  $highscores = array();

  // If the player made it on the high score list
  if ($player_score > $highscore_array[9][score]) {
    foreach($highscore_array as $k => $value) {
      $score = $value[score];

      // The player has not beaten these scores
      if ($score >= $player_score) {
        $highscores[$k] = $value;
      }

      // The player has beat this score
      if ($score < $player_score) {
          $key = $k;  // current value index
          // add the player at this spot on the high score list
          $highscores[$k] = $player_array;
          // loop through the rest of the highscores, up to the 9th item
          for ($i = $key; $i < 9; $i++) {
            $highscores[$i + 1] = $highscore_array[$i];
          }
          break; // end the loop here
      }
    }

    // Parse $highscores into a json string and rewrite scores.json
    $jsonscores = json_encode($highscores);
    file_put_contents('scores.json', $jsonscores);

    // print "Howdy Partner!"
    echo "Howdy Partner!";
  }
  // If the player did not make it on the highscore list
  else {
    // Print "No high score"
    echo "No high score";
  }
?>