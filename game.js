setupGameBoard();

// Note to self, it would have been easyer to start with "pick two", which would have simple "check for equality"
// And then go for the slider game alter, which has more logic

const correctBoard = ["item_1", "item_2", "item_3", "item_4", "item_5", "item_6", "item_7", "item_8", "item_9"];
var numMoves = 0;
var bestScore = 20;

function setupGameBoard() {
    var parent = document.getElementById("gameboard");

    for (var i=1; i<9; i++) {
        var item = generateInsertableSquare(i, true);
        parent.appendChild(item);
    }
    
    var item = generateInsertableSquare(9, false);
    parent.appendChild(item);

}

function generateInsertableSquare(idNumber, isMovable) {
    var item = document.createElement("div");
    item.innerHTML = idNumber;
    item.id = idNumber;
    item.className = "grid-item";
    item.isFlipped = false;

    if (isMovable) {
        item.style.backgroundColor = ("rgb(0, 0, " +idNumber*20 + ")" );
    } else {
        item.style.backgroundColor = "white";
    }

    item.style.color = "red";

    // https://stackoverflow.com/questions/4631975/detecting-mouse-click-on-div-with-javascript-without-side-effects
    // https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
    // item.onclick... would it be the same?
    //item.onclick = "move(id)";
    item.onclick = function(event) {
        console.log(event);
        console.log(event.path[0].id);

        flipTile(event.path[0].id)
    }

    //
    // Touch device support:::--->
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events
    // remember, prevent default because often browsers also emulate mouseclicks
    // 

    // Touch events
    item.addEventListener('touchstart', process_touchstart, false);
    //item.addEventListener('touchmove', process_touchmove, false);
    //item.addEventListener('touchcancel', process_touchcancel, false);
    //item.addEventListener('touchend', process_touchend, false);

    // touchstart handler
    function process_touchstart(ev) {
    // Use the event's data to call out to the appropriate gesture handlers
    //switch (ev.touches.length) {
      //case 1: handle_one_touch(ev); break;
      //case 2: handle_two_touches(ev); break;
      //case 3: handle_three_touches(ev); break;
      //default: gesture_not_supported(ev); break;
    //}
      console.log(ev);
      //move("hitx: touchstartevent detected, woha!");
      //move("hitx: " + ev);
      //move("hitx: " + ev.targetTouches[0].target)
      moveTile("hitx: " + ev.targetTouches[0].target.id)

      // Set call preventDefault()
      ev.preventDefault();
    }
  
    return item;
}

function flipTile(id) {
    var tile = document.getElementById(id);
    debug("Tile state: " + tile.isFlipped);
    if (tile.isFlipped) {
        tile.style.backgroundColor = ("rgb(0, 0, " +id*20 + ")" ); //Make original shade of color
        tile.isFlipped = false;
    } else {
        tile.style.backgroundColor = ("rgb(" + id*20 + ", " + id*20 + ", 0)" ); //Make yellowish in same nuance as original shade
        tile.isFlipped = true;
    }
   
    numMoves++
    document.getElementById("currentGameInfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;
    debug(id);
};

function moveTile(id) {
    //Note, not doing this now, will do this later, rateher doing "find equals now"

    //TODO: move it
    // ie, check that it is adjacent to number 10, then
    // transition this to white
    // transition position of 10 to the color of this (based on rgb(0, 0, 20*itemnumber))
    // if order is 1...10, game won
    // bonus, make function for taking in pictures, adjusting/clipping, and transitioning

    // verify if board order matches correctBoard, if yes, tada, victory, show game won/num moves->play again

    numMoves++
    document.getElementById("currentGameInfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;
    debug(id);
};

function debug(output) {
    console.log(output);
    var parent = document.getElementById("debuglist");
    var listItem = document.createElement("li");
    listItem.innerHTML = output;
    //parent.appendChild(listItem);
    // https://stackoverflow.com/questions/618089/can-i-insert-elements-to-the-beginning-of-an-element-using-appendchild
    parent.prepend(listItem);
}
