var midiName=[];
var midiNameIndex;
//var midiNAME.=new midiNAME;

var FileIn;
//var currentfile=''
function Application() {

  // GA Tracking
  this._trackEvent = function() {
    if('function' === typeof window.ga) {
      ga.apply(null, ['send', 'event'].concat([].slice.call(arguments, 0)));
    }
  };

	// Registering ui elements
	this.filePicker=document.querySelector('input[type="file"]');
  this.filePicker.addEventListener('change', this.readFile.bind(this));
  this.pickFileButton=document.getElementsByClassName('pick')[0];
	this.playButton=document.getElementsByClassName('play')[0];
	this.pauseButton=document.getElementsByClassName('pause')[0];
	this.stopButton=document.getElementsByClassName('stop')[0];
	this.previousButton=document.getElementsByClassName('previous')[0];
	this.nextButton=document.getElementsByClassName('next')[0];
	this.volumeUpButton=document.getElementsByClassName('volumeup')[0];
	this.volumeDownButton=document.getElementsByClassName('volumedown')[0];
	this.volumeMuteButton=document.getElementsByClassName('volumemute')[0];
	this.textSmallerButton=document.getElementsByClassName('textsmaller')[0];
	this.textBiggerButton=document.getElementsByClassName('textbigger')[0];
	this.outputSelectButton=document.getElementsByClassName('outputselect')[0];
  
  this.PanicButton=document.getElementsByClassName('panic')[0];
	// lyrics display
	this.lyricsDisplayer=new MIDILyricsDisplayer(
		document.querySelector('div.lyrics'));
	this.pickFileButton.addEventListener('click', this.pickFile.bind(this), true);
  
	this.playButton.addEventListener('click', this.play.bind(this), true);
	this.pauseButton.addEventListener('click', this.pause.bind(this), true);
	this.stopButton.addEventListener('click', this.stop.bind(this), true);
	//this.backwardButton.addEventListener('click', this.backward.bind(this));
	//this.forwardButton.addEventListener('click', this.forward.bind(this));
	this.volumeUpButton.addEventListener('click', this.volume.bind(this), true);
  
  // Try to enable the MIDI Access
	if(!navigator.requestMIDIAccess) {
		this.noMidiAccess();
	} else {
		navigator.requestMIDIAccess().then(this.midiAccess.bind(this),
			this.noMidiAccess.bind(this));
	}
};

Application.prototype.midiAccess = function(midiAccess) {
	this.outputs = midiAccess.outputs;
	this.outputKeys = [];
  var iter = this.outputs.values();
  var output;
  while(output = iter.next()) {
    if(output.done) {
      break;
    }
    this.outputKeys.push(output.value.id);
  }
	// check output
	if(!this.outputs.size) {
	  this.noMidiOutputs();
	  return;
	}
  this._trackEvent('setup', 'midiaccess', this.outputKeys[0], this.outputs.size);
	document.getElementById('about').classList.add('selected');
  document.getElementById('text').classList.add('selected');
	// creating player
	this.midiPlayer=new MIDIPlayer({
	  'output': this.outputs.get(this.outputKeys[0])
	});
	// Download the intro
	//this.downloadFile("Hello.mid");
   this.downloadFile(FileIn||'data:audio/midi;base64,TVRoZAAAAAYAAQABAGBNVHJrAAAAbQD/AQ1IZWxsbyBrYXJhb2tlAMEAAP8FAkhlAJFWeUCRVgBA/wUDbGxvAJFgeV+RYAAA/wUDXEthAJFdeUCRXQAA/wUCcmEAkVR5QJFUAAD/BQFvAJFYeUCRWAAA/wUCa2UAkV95QJFfAAD/LwA=');
   if(!FileIn){
     documentTitle('TestMidi.mid');
     document.getElementById("current").innerHTML="<marquee>"+'TestMidi.mid'+"</marquee>";
   };
 
  // enable the file picker
	this.pickFileButton.removeAttribute('disabled');
	this.volumeUpButton.removeAttribute('disabled');
	this.volumeDownButton.removeAttribute('disabled');
	this.volumeMuteButton.removeAttribute('disabled');
	this.textSmallerButton.removeAttribute('disabled');
	this.textBiggerButton.removeAttribute('disabled');
	this.outputSelectButton.removeAttribute('disabled');
  
  this.PanicButton.removeAttribute('disabled');
};

Application.prototype.noMidiAccess = function() {
  this._trackEvent('setup', 'nomidiaccess', window.navigator.userAgent);
	document.getElementById('jazz').classList.add('selected');
};

Application.prototype.noMidiOutputs = function() {
  this._trackEvent('setup', 'nomidioutput', window.navigator.userAgent);
	document.getElementById('nooutput').classList.add('selected');
};

Application.prototype.pickFile = function() {
  this._trackEvent('use', 'pickfile');
	this.filePicker.click();
  
};


Application.prototype.setOutput = function(event, params) {
  this.midiPlayer.output = this.outputs[params.value];
};

Application.prototype.readFile = function(event) {
  currentfile='';
	var reader = new FileReader();
	this._trackEvent('use', 'filepicked', event.target.files[0].name, event.target.files[0].length);
	reader.readAsArrayBuffer(event.target.files[0]);
	reader.onloadend=(function(event) {
    this._trackEvent('use', 'fileloaded');
		this.loadFile(event.target.result);
   
	}).bind(this);
  documentTitle(event.target.files[0].name);
  document.getElementById("current").innerHTML="<marquee>"+event.target.files[0].name+"</marquee>";
};

Application.prototype.loadFile = function(buffer) {
  this.panic();
	// creating the MidiFile instance
	midiFile=new MIDIFile(buffer);
	this.midiPlayer.load(midiFile);
	this.playButton.removeAttribute('disabled');
	this.lyricsDisplayer.loadLyrics(midiFile.getLyrics());
  /////////////////////
  this.play()
  
};

Application.prototype.play = function(buffer) {
	var playTime;
	if((playTime=this.midiPlayer.play(this.endCallback.bind(this)))
			||(playTime=this.midiPlayer.resume(this.endCallback.bind(this)))) {
		this.playButton.setAttribute('disabled','disabled');
		this.pauseButton.removeAttribute('disabled');
		this.stopButton.removeAttribute('disabled');
		this.lyricsDisplayer.start(playTime);
    document.getElementById('text').classList.add('selected');
	}

};

Application.prototype.pause = function(buffer) {
	if(this.midiPlayer.pause()) {
    this._trackEvent('use', 'pause');
		this.playButton.removeAttribute('disabled');
		this.pauseButton.setAttribute('disabled','disabled');
		this.stopButton.setAttribute('disabled','disabled');
		this.lyricsDisplayer.stop();
    this.panic();
	}
};

Application.prototype.stop = function(buffer) {
	if(this.midiPlayer.stop()) {
    this._trackEvent('use', 'stop');
		this.playButton.removeAttribute('disabled');
		this.pauseButton.setAttribute('disabled','disabled');
		this.stopButton.setAttribute('disabled','disabled');
		this.lyricsDisplayer.stop();
    this.panic();
    
	}
};

/////////////////////PANIC/////////////////////////////////
Application.prototype.panic = function() {
  for(var i=0; i<16; i++) {
    var data=[parseInt("0xb"+i.toString(16), 16), 0x78, 0x00];
    this.midiPlayer.output.send(data, 0);
  }
};
/////////////////////PANIC/////////////////////////////////


Application.prototype.endCallback = function() {
  this._trackEvent('use', 'playend');
	this.playButton.removeAttribute('disabled');
	this.pauseButton.setAttribute('disabled','disabled');
	this.stopButton.setAttribute('disabled','disabled');
};

Application.prototype.backward = function(buffer) {};

Application.prototype.forward = function(buffer) {};

Application.prototype.volume = function(params) {
  this._trackEvent('use', 'volume', params, this.midiPlayer.volume);
	if('less'===params) {
		this.midiPlayer.volume=(this.midiPlayer.volume<10?
			0:this.midiPlayer.volume-10);
	} 
  else if('more'===params) {
		this.midiPlayer.volume=(this.midiPlayer.volume>90?
			100:this.midiPlayer.volume+10);
	} 
  else if('mute'===params) {
		this.midiPlayer.volume=0;
	}
};

Application.prototype.downloadFile = function(url) {
  
  //currentfile=null;
  //documentTitle(null,300,15)
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";
	oReq.onload = (function (oEvent) {
		this.loadFile(oReq.response);
	}).bind(this);
	oReq.send(null);
};

Application.prototype.selectOutput = function(event) {
  this._trackEvent('use', 'selectoutput');
  var iter = this.outputs.values();
  var output;
  var outputChooser = document.getElementById("outputChooser");
  while(outputChooser.firstChild) {
    outputChooser.removeChild(outputChooser.firstChild);
  }
  while(output = iter.next()) {
    if(output.done) {
      break;
    }
    var opt = document.createElement("option");
    opt.value = output.value.id;
    opt.text = output.value.name;
    outputChooser.add(opt);
  }
	document.getElementById('output').classList.add('selected');
};
Application.prototype.closeLirik = function(event, params) {
  this._trackEvent('use', 'closelirik', params);
	document.getElementById(params).classList.remove('selected');
};

Application.prototype.setOutput = function(event) {
  this._trackEvent('use', 'setoutput', event.target[0].value);
	document.getElementById('output').classList.remove('selected');
	if(!event.target[0].value)
		return;
	this.midiPlayer.stop();
	this.midiPlayer.output = this.outputs.get(event.target[0].value);
	this.midiPlayer.play();
};

Application.prototype.selectFile = function() {
	if(!event.target.value)
		return;
	downloadFile("./midiFile/"+event.target.value);
	//document.querySelector('select').addEventListener('change', selectFile);
};

Application.prototype.closePopin = function(event, params) {
  this._trackEvent('use', 'closepopin', params);
	document.getElementById(params).classList.remove('selected');
};

var app=new Application();

/*****************************/
var titleDoc;    
function docTitle() {
 titleDoc = titleDoc.substring(1, titleDoc.length) + titleDoc.substring(0, 1);
 document.title = titleDoc;
 setTimeout("docTitle()", 400);
};
function documentTitle(FILENAME) {
  titleDoc=FILENAME+"--***--";
  docTitle();
};

      /* MidiKaraoke.html?midi=path/path/midiname.mid[.kar] */
      function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    FileIn=getParameterByName("midi");
    if(FileIn) {
      var x=document.getElementById("about");
      x.style.display="none";
    };
    
    var GetFiles=function(){
          var fileInput = document.querySelector("#myfiles");
          var files = fileInput.files;
          var fl=midiNameIndex=files.length;
          var i=0;
          while ( i < fl) {
            midiName[i]=files[i];
            i++;
          }
          var htmls="<form name='MidiForm' method='POST'><span style='font-size: 9pt'><font size='1'><select size='1' name='Pilihan'  multiple='true' style='height:150px' onchange='runMidiPlay(this.selectedIndex)' style='font-size: 9pt'>";
          
          for(var i=0; i<midiName.length;i++){
            htmls=htmls+"<option>"+midiName[i].name+"</option>";
          };
          //console.log('index',midiNameIndex);
          htmls=htmls+"</select></font></span></form>";
          document.getElementById('selectfile').innerHTML=htmls;
        };
    var GetDir=function(){
          var fileInput = document.querySelector("#myDir");
          var files = fileInput.files;
          var fl=midiNameIndex=files.length;
          var i=0;
          while ( i < fl) {
            midiName[i]=files[i];
            i++;
          }
          var htmls="<form name='MidiForm' method='POST'><span style='font-size: 9pt'><font size='1'><select size='1' name='Pilihan'  multiple='true' style='height:150px' onchange='runMidiPlay(this.selectedIndex)' style='font-size: 9pt'>";
          
          for(var i=0; i<midiName.length;i++){
            htmls=htmls+"<option>"+midiName[i].name+"</option>";
          };
          //console.log('index',midiNameIndex);
          htmls=htmls+"</select></font></span></form>";
          document.getElementById('selectfile').innerHTML=htmls;
        };

        
    var selectedFile=0;
    var current = 0;

    function runMidiPlay(nr){
      document.title ='';
      selectedFile=nr;
      app.downloadFile(URL.createObjectURL(midiName[nr]));
      document.MidiForm.Pilihan.selectedIndex=nr;
      documentTitle(midiName[nr].name);
      document.getElementById("current").innerHTML="<marquee>"+midiName[nr].name+"</marquee>";
    };

    function PlayRandom(){
      document.title ='';
      var temp;
      temp=Math.floor(Math.random() * midiName.length);
      selectedFile=temp;
      current=selectedFile;
      runMidiPlay(current);
      //console.log('random' ,midiName[selectedFile].name);
    };

    function PlayNext() {
      if (current === midiName.length - 1) {
        current = 0;
      } 
      else {
        current++;
      }
      runMidiPlay(current);
    };

    function PlayPrev() {
      if (current === 0) {
        current = midiName.length - 1;
      } 
      else {
        current--;
      }
      runMidiPlay(current);
    };
    /*  
    function nextSong(){
      if(CONTINUE==true){
        console.log('CONTINUE :',CONTINUE);
        PlayNext()
      } 
    }; 
    function clear(){};
    function PlayAll(){};
    */
