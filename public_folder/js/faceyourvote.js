var R;
var currentState;

var rStates = {};
var cStates = {};

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
  st.animate({"stroke-width": "3",stroke: "#af4"}, 75); // highlight
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

function cInColors(c) {
  var Colors;
  switch(c)
  {
  case 0:
    Colors = "#18286b";
    break;
  case 1:
    Colors = "#5b6795";
    break;
  case 2:
    Colors = "#8a91b1";
    break;
  case 3:
    Colors = "#fff";
    break;
  case 4:
    Colors = "#c28280";
    break;
  case 5:
    Colors = "#aa5252";
    break;
  case 6:
    Colors = "#880a0a";
    break;
  default:
    Colors = "#fff";
  }
  return Colors;
};

function pulse(obj,margin){
  if (!margin) { margin='marginLeft'; }
  obj.stop();
  obj.stop();
  var animStart = {
    width: '110px',
    height: '110px',
    backgroundSize: '112px',
    marginTop: '-5px'
  };
  animStart[margin] = '-5px';
  var animEnd = {
    width: "100px",
    height: "100px",
    marginTop: "0px",
    backgroundSize: '100px'
  };
  animEnd[margin] = "0px";
  obj.animate(animEnd,0);
  obj.animate(animStart,0);
  obj.animate(animEnd,200);
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
  
  return(total);
}

function initializeLastUpdated() {
  var time = fyv_data["source"]["timestamp"];
//  var datetime = Date.parse(time);
  var year = time.substring(0,4)
  var month = time.substring(4,6)  
  var day = time.substring(6,8)    
  var MyUpdate = parseDate(year + '-' + month + '-' + day);
  $("#lastUpdated").html("Last Updated: "+ MyUpdate);
}

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  var myString = new Date(parts[0], parts[1]-1, parts[2])
  var txt = new String(myString);
  var mySplitResult = txt.split(" ");
	var MyFormatted = mySplitResult[0] + ' ' + mySplitResult[1] + ' ' + mySplitResult[2] + ' ' + mySplitResult[3];	
  return MyFormatted; // months are 0-based
}

function changeFaces(c) {
  $("#romney").css('background-image', "url(img/r"+c+".jpg)");
  $("#obama").css('background-image', "url(img/d"+(6-c)+".jpg)");
  pulse($("#obama"));
  pulse($("#romney"),'marginRight');
}

window.onload = function () {
  R = Raphael("container", width, height),
    attr = defaultAttr

  totalEvBoxes();
  MyTotal = initializeSlider();
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
		  var c = fyv_data["states"][stateName]["c"];
		
      //alert("dem: "+dem+"| rep: "+rep);

      if (c > 3) {
        rState.color = "rgba("+repR+","+repG+","+repB+","+(rep-0.5)*2+")";
      } else if (c < 3) {
        rState.color = "rgba("+demR+","+demG+","+demB+","+(dem-0.5)*2+")";
      } else {
        rState.color = "rgba(255,255,255,0.8)";
      }

      rState.attr({fill: rState.color});
      rStates[stateName] = rState;

      //Do Work on Map
      (function (st, stateAbbrev) {
        var star = "<span>&#9733;</span>";
        var fullStateName = fyv_data["states"][stateAbbrev]["n"];
        var c = fyv_data["states"][stateAbbrev]["c"];
        
        if (cStates[c] == null) {
          cStates[c] = [];
        }
        cStates[c].push(rStates[stateName]);
        
        var dem = 3 - c;
        var rep = c - 3;

        $(st[0]).hover(function () {
          if (currentState != st) {
      			var bar = (fyv_data["states"][stateAbbrev]["e"]*100.00/MyTotal)*10;
      			var fixedbar = bar.toFixed(0);
      			var MyLeft = (750 - fixedbar)/2;
      			MyLeft.toFixed(0);			
      			var MyColor = cInColors(c);
      			$("#MyBar").css({'display':'block', 'width' : fixedbar, 'margin-left' : MyLeft, 'background-color' : MyColor});
								
            selectState(st);
            cleanup(R,rStates);
            changeFaces(c);
            currentState = st;
            
	        }
        }, function () {
          deselectState(st);
          cleanup(R,rStates);
          $("#romney").css('background-image', "url(img/r2.jpg)");
          $("#obama").css('background-image', "url(img/d2.jpg)");
          $("#MyBar").css('display', "none");
          currentState = null;
          totalEvBoxes();
        }).css('cursor', 'pointer');

      })(rStates[stateName], stateName);
    }
  }
  cleanup(R,rStates);
};

$(document).ready(function() {
  $( "#open-event" ).tooltip({
    show: null,
    position: {
      my: "center top",
      at: "center bottom"
    }
  });
  $('.slider').hover( function(){
      BarStates($(this).data("num"));
   },
   function(){
      HideStates($(this).data("num"));
   });
});

function HideStates(cValue){
  var theStates = cStates[cValue];
  for (var i = 0; i < theStates.length; i++) {
      //console.log(theStates[i]);
      deselectState(theStates[i]);
  }
  $("#romney").css('background-image', "url(img/r2.jpg)");
  $("#obama").css('background-image', "url(img/d2.jpg)");
  cleanup(R,rStates);
}

function BarStates(cValue) {
  var theStates = cStates[cValue];
  for (var i = 0; i < theStates.length; i++) {
      //console.log(theStates[i]);
      selectState(theStates[i]);
  }
  changeFaces(cValue);
  cleanup(R,rStates);
}