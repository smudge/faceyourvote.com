var selected;

var width = 800.0;
var height = 500.0;

var demR = 24;
var demG = 40;
var demB = 107;

var repR = 136;
var repG = 10;
var repB = 10;

var defaultAttr = {
  "stroke": "#fff",
  "fill": "#88f",
  "stroke-opacity": "1",
  "stroke-linejoin": "round",
  "stroke-miterlimit": "4",
  "stroke-width": "0.75",
  "stroke-dasharray": "none"
};

var scale = width / 1000.0;
var hoverScale = 1.1;

var rStates = {};

var selectState = function(st) {
  //st.animate({fill: "#ddd"}, 200);
  st.animate({"stroke-width": "3",stroke: "#fff"}, 75);
  //st.scale(hoverScale)
  st.toFront();
  rStates["dc"].toFront(); //exception for DC
  R.safari();
};

var deselectState = function(st) {
  //if (selected != state) {
  st.animate({fill: st.color, stroke: "#fff", "stroke-width": "0.75"}, 100);
  //st.scale(1/hoverScale)
  st.toFront();
  rStates["dc"].toFront(); //exception for DC
  R.safari();
  //}
};

window.onload = function () {
  var R = Raphael("container", width, height),
    attr = defaultAttr;

  //Draw Map and store Raphael paths
  for (var stateName in stateAbbrev) {
    var state = stateAbbrev[stateName].toLowerCase();
    var rState = R.path(usMap[state]).attr(attr).scale(scale, scale, 0, 0);
    if (state == "dc") {
      rState.scale(3); //exception for DC
    }
    var dem = (stateData[stateName][1]-4)/2.0;
    var rep = (stateData[stateName][2]-4)/2.0;
    var diff = 0;

    if (rep > dem) {
      //diff = Math.round(100-100*rep);
      //rState.color = "rgb("+(diff+repR)+","+(diff+repG)+","+(diff+repB)+")";
      rState.color = "rgba("+repR+","+repG+","+repB+","+(rep*0.7+0.3)+")";
    } else if (rep < dem) {
      //diff = Math.round(100-100*dem);
      //rState.color = "rgb("+(diff+demR)+","+(diff+demG)+","+(diff+demB)+")";
      rState.color = "rgba("+demR+","+demG+","+demB+","+(dem*0.7+0.3)+")";
   } else {
      rState.color = "rgba(150,100,150,0.5)";
    }

    rState.attr({fill: rState.color});
    rStates[state] = rState;
  }

  //Do Work on Map
  for (var state in rStates) {

    (function (st, state) {

      st[0].style.cursor = "pointer";

      $(st[0]).mouseover(function () {
        selectState(st);
      }).mouseleave(function () {
        deselectState(st);
      });
      /*st[0].onclick = function () {
        if (selected != null && selected != state) {
          var sstate = rStates[selected];
          sstate.attr({fill: sstate.color });
          sstate.toFront();
          R.safari();
        }
        selected = state;
      };*/


    })(rStates[state], state);
  }

};
