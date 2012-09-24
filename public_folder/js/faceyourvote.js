var currentState;

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

function setEvBoxes(dem,rep) {
  $("#obama_ev").text(dem);
  $("#romney_ev").text(rep);
}

function totalEvBoxes() {
  var summary = fyv_data["summary"];
  var dVotes = summary["0"] + summary["1"] + summary["2"];
  var rVotes = summary["6"] + summary["5"] + summary["4"];

  setEvBoxes(dVotes,rVotes);
}

var selectState = function(st) {
  st.animate({"stroke-width": "3",stroke: "#fff"}, 75);
  st.toFront();
};

var deselectState = function(st) {
  //if (selected != state) {
  st.animate({fill: st.color, stroke: "#fff", "stroke-width": "0.75"}, 70);
};

var cleanup = function(R,rStates) {
  rStates["DC"].toFront(); //exception for DC
  R.safari(); //fixes some rendering bugs in safari.
};

function cInWords(c) {
  var words;
  switch(c)
  {
  case 6:
    words = "Solidly Republican";
    break;
  case 5:
    words = "Likely Republican";
    break;
  case 4:
    words = "Leaning Republican";
    break;
  case 3:
    words = "Complete Toss-Up";
    break;
  case 2:
    words = "Leaning Democrat";
    break;
  case 1:
    words = "Likely Democrat";
    break;
  case 0:
    words = "Solidly Democrat";
    break;
  default:
    words = "unknown";
  }
  return words;
};

function pulse(obj,margin){
  if (!margin) { margin='marginLeft'; }
  obj.stop();
  obj.stop();
  var animStart = {
    width: '106px',
    height: '106px',
    backgroundSize: '106px',
    marginTop: '-3px'
  };
  animStart[margin] = '-3px';
  var animEnd = {
    width: "100px",
    height: "100px",
    marginTop: "0px",
    backgroundSize: '100px'
  };
  animEnd[margin] = "0px";
  obj.animate(animEnd,0);
  obj.animate(animStart,100);
  obj.animate(animEnd,100);
};

function initializeSlider() {
  var summary = fyv_data["summary"];
  var total = 0;
  for (var c in summary) {
    total+= summary[c];
  }
  for (var c in summary) {
    $("#c"+c).width((summary[c]*100/total)+"%");
  }
}

function initializeLastUpdated() {
  var time = fyv_data["source"]["timestamp"];
  var datetime = Date.parse(time);
  $("#lastUpdated").html("Last Updated: "+datetime);
}

var rStates = {};

window.onload = function () {
  var R = Raphael("container", width, height),
    attr = defaultAttr

  totalEvBoxes();
  initializeSlider();
  initializeLastUpdated();

  //Draw Map and store Raphael paths
  var states = fyv_data["states"];
  for (var stateName in states) {
    var state = usMap[stateName.toLowerCase()];
    //If the state matches a state in our vector data
    if (state) {
      var rState = R.path(state).attr(attr).scale(scale, scale, 0, 0);
      if (stateName == "DC") { rState.scale(3);} //exception for DC

      // var dem = (stateData[fullStateName][1]-4)/2.0;
      // var rep = (stateData[fullStateName][2]-4)/2.0;
      var dem = fyv_data["states"][stateName]["d"]/100.0;
      var rep = fyv_data["states"][stateName]["r"]/100.0;
      //alert("dem: "+dem+"| rep: "+rep);

      if (rep > dem) {
        rState.color = "rgba("+repR+","+repG+","+repB+","+(rep-0.5)*2+")";
      } else if (rep < dem) {
        rState.color = "rgba("+demR+","+demG+","+demB+","+(dem-0.5)*2+")";
      } else {
        rState.color = "rgba(150,100,150,0.5)";
      }

      rState.attr({fill: rState.color});
      rStates[stateName] = rState;

      //Do Work on Map
      (function (st, stateAbbrev) {
        var star = "<span>&#9733;</span>";
        var fullStateName = fyv_data["states"][stateAbbrev]["n"];
        var c = fyv_data["states"][stateAbbrev]["c"];
        var dem = 3 - c;
        var rep = c - 3;

        $(st[0]).hover(function () {
          if (currentState != st) {
            selectState(st);
            cleanup(R,rStates);
            $("#hoverTip").fadeOut();
            $("#mainHeader").html(star+fullStateName+star);
            $("header h3").html(cInWords(c));
            $("#romney").css('background-image', "url(/img/r"+c+".jpg)");
            $("#obama").css('background-image', "url(/img/d"+(6-c)+".jpg)");
            pulse($("#obama"));
            pulse($("#romney"),'marginRight');
            currentState = st;
            evs = fyv_data["states"][stateAbbrev]["e"];
            if (evs) {
              if (dem > rep) {
                setEvBoxes(evs,0);
              }
              if (rep > dem) {
                setEvBoxes(0,evs);
              }
              if (rep === dem) {
                setEvBoxes(evs+"?",evs+"?");
              }
            }
          }
        }, function () {
          deselectState(st);
          cleanup(R,rStates);
          $("#mainHeader").html("Face"+star+"Your"+star+"Vote");
          $("header h3").html("getting straight to the point");
          $("#romney").css('background-image', "url(/img/r2.jpg)");
          $("#obama").css('background-image', "url(/img/d2.jpg)");
          currentState = null;
          totalEvBoxes();
        }).click(function () {
          //Maybe sticky-select on click?
        }).css('cursor', 'pointer');

      })(rStates[stateName], stateName);
    }
  }
  cleanup(R,rStates);
};
