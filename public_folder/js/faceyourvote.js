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


var selectState = function(st) {
  st.animate({"stroke-width": "3",stroke: "#fff"}, 75);
  st.toFront();
};

var deselectState = function(st) {
  //if (selected != state) {
  st.animate({fill: st.color, stroke: "#fff", "stroke-width": "0.75"}, 100);
};

var cleanup = function(R,rStates) {
  rStates["dc"].toFront(); //exception for DC
  R.safari(); //fixes some rendering bugs in safari.
};

window.onload = function () {
  var R = Raphael("container", width, height),
    attr = defaultAttr,
    rStates = {};

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
      rState.color = "rgba("+repR+","+repG+","+repB+","+(rep*0.7+0.3)+")";
    } else if (rep < dem) {
      rState.color = "rgba("+demR+","+demG+","+demB+","+(dem*0.7+0.3)+")";
   } else {
      rState.color = "rgba(150,100,150,0.5)";
    }

    rState.attr({fill: rState.color});
    rStates[state] = rState;

    //Do Work on Map
    (function (st, state) {

      $(st[0]).hover(function () {
        selectState(st);
        cleanup(R,rStates);
      }, function () {
        deselectState(st);
        cleanup(R,rStates);
      }).css('cursor', 'pointer');

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
