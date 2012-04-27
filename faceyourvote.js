var selected;

var width = 800.0;
var height = 800.0;

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

window.onload = function () {
  var R = Raphael("container", width, height),
    attr = defaultAttr,
  usRaphael = {};
  
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
      diff = 100-rep*100
      rep = Math.round(diff+155)
      dem = diff;
    } else {
      diff = 100-dem*100;
      dem = Math.round(diff+155)
      rep = diff;
    }
    
    rState.color = "rgb("+rep+","+diff+","+dem+")";
    rState.attr({fill: rState.color});
    usRaphael[state] = rState;
  }
  
  //Do Work on Map
  for (var state in usRaphael) {
    
    (function (st, state) {

      st[0].style.cursor = "pointer";

      st[0].onmouseover = function () {
        st.animate({fill: "#ddd"}, 200);
        st.scale(hoverScale)
        st.toFront();
        usRaphael["dc"].toFront(); //exception for DC
        R.safari();
      };
      
      /*st[0].onclick = function () {
        if (selected != null && selected != state) {
          var sstate = usRaphael[selected];
          sstate.attr({fill: sstate.color });
          sstate.toFront();
          R.safari();
        }
        selected = state;
      };*/
      
      st[0].onmouseout = function () {
        //if (selected != state) {
        st.animate({fill: st.color }, 200);
        st.scale(1/hoverScale)
        st.toFront();
        usRaphael["dc"].toFront(); //exception for DC
        R.safari();
        //}

      };
                 
    })(usRaphael[state], state);
  }
          
};