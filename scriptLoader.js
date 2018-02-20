function jsLoad(b,c){
  function f(h,d){
    d=d||function(){};
    var a=document.createElement("script");
    a.type="text/javascript";
    if(a.readyState)
      a.onreadystatechange=function(){
        if(a.readyState==="loaded"||a.readyState==="complete"){
          a.onreadystatechange=null;
          d()
        }
      };
    else 
      a.onload=function(){
        d()
      };
    a.src=h;
    document.getElementsByTagName("head")[0].appendChild(a)
  }
  c=c||function(){};
  if(typeof b==="string")
    f(b,c);
  else if(b instanceof Array){
    var e=0,
        i=b.length,
        g=function(){
          if(e>=i){
            c();
            return false
          }
          f(b[e],g);
          e++
        };
    g()
  }
};
function cssLoad(b,c){
  function f(h,d){
    d=d||function(){};
    var a=document.createElement("link");
    a.rel="stylesheet";
    a.type="text/css";
    if(a.readyState)
      a.onreadystatechange=function(){
        if(a.readyState==="loaded"||a.readyState==="complete"){
          a.onreadystatechange=null;
          d()
        }
      };
    else 
      a.onload=function(){d()};
    a.href=h;
    document.getElementsByTagName("head")[0].appendChild(a)
  }
  c=c||function(){};
  if(typeof b==="string")
    f(b,c);
  else if(b instanceof Array){
    var e=0,
        i=b.length,
        g=function(){
          if(e>=i){
            c();
            return false
          }
          f(b[e],g);
          e++
        };
  g()
  }
};
var JSfiles = [
 ["MIDI.Events.js"],
 ["fromcodepoint.js"],
 ["codepointat.js"],
 ["UTF-8.js"],
 ["MIDI.FileHeader.js"],
 ["MIDI.FileTrack.js"],
 ["MIDI.File.js"],
 ["MIDI.Player.js"],
 ["MIDI.LyricsDisplayer.js"],
 ["MIDI.Application.js"]
];
cssLoad("Style.css");
jsLoad(JSfiles);
