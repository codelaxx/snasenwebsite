setup();

function setup() {
    var parent = document.getElementById("gameboard");

    for (var i=1; i<9; i++) {
        var item = createSquare(i, true);
        parent.appendChild(item);
    }
    
    var item = createSquare(9, false);
    parent.appendChild(item);

}

function createSquare(idNumber, isMovable) {
    var item = document.createElement("div");
    item.innerHTML = idNumber;
    item.id = ("item_" +idNumber);
    item.className = "grid-item";

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

        move(event.path[0].id)
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
      move("hitx: touchstartevent detected, woha!");
      move("hitx: " + ev);
      move("hitx: " + ev.targetTouches[0].target)
      move("hitx: " + ev.targetTouches[0].target.id)

      // Set call preventDefault()
      ev.preventDefault();
    }
  
    return item;
}

function move(id) {
    //TODO: move it
    // ie, check that it is adjacent to number 10, then
    // transition this to white
    // transition position of 10 to the color of this (based on rgb(0, 0, 20*itemnumber))
    // if order is 1...10, game won
    // bonus, make function for taking in pictures, adjusting/clipping, and transitioning

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
