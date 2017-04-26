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
	// Commands management
	/*
  this.cmdMgr=new Commandor(document.documentElement,'exec:');
	this.cmdMgr.suscribe('pickFile',this.pickFile.bind(this));
	this.cmdMgr.suscribe('setOutput',this.setOutput.bind(this));
	this.cmdMgr.suscribe('play',this.play.bind(this));
	this.cmdMgr.suscribe('pause',this.pause.bind(this));
	this.cmdMgr.suscribe('stop',this.stop.bind(this));
	this.cmdMgr.suscribe('backward',this.backward.bind(this));
	this.cmdMgr.suscribe('forward',this.forward.bind(this));
	this.cmdMgr.suscribe('volume',this.volume.bind(this));
	this.cmdMgr.suscribe('setTextSize',this.lyricsDisplayer.setTextSize.bind(this.lyricsDisplayer));
	this.cmdMgr.suscribe('closePopin',this.closePopin.bind(this));
  
 
  this.cmdMgr.suscribe('closeLirik',this.closeLirik.bind(this));
  
	this.cmdMgr.suscribe('selectOutput',this.selectOutput.bind(this));
	this.cmdMgr.suscribe('setOutput',this.setOutput.bind(this));
  this.cmdMgr.suscribe('panic',this.panic.bind(this));
  
	*/

	this.pickFileButton.addEventListener('click', this.pickFile.bind(this), true);
  
  //this.setOutput.addEventListener('click', this.setOutput.bind(this), true);
	this.playButton.addEventListener('click', this.play.bind(this), true);
	this.pauseButton.addEventListener('click', this.pause.bind(this), true);
	this.stopButton.addEventListener('click', this.stop.bind(this), true);
	//this.backwardButton.addEventListener('click', this.backward.bind(this));
	//this.forwardButton.addEventListener('click', this.forward.bind(this));
	this.volumeUpButton.addEventListener('click', this.volume.bind(this), true);
  
	//this.setTextSize.addEventListener('click', this.lyricsDisplayer.setTextSize.bind(this.lyricsDisplayer), true);
	//this.closePopin.addEventListener('click', this.closePopin.bind(this), true);
  
 
  //this.closeLirik.addEventListener('click', this.closeLirik.bind(this), true);
 
	//this.selectOutput.addEventListener('click', this.selectOutput.bind(this), true);
	//this.setOutput.addEventListener('click', this.setOutput.bind(this), true);
  //this.panic.addEventListener('click', this.panic.bind(this), true);

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
     documentTitle('TestMidi.mid',300,15);
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
  //documentTitle('',300,15);
	var reader = new FileReader();
	this._trackEvent('use', 'filepicked', event.target.files[0].name, event.target.files[0].length);
	reader.readAsArrayBuffer(event.target.files[0]);
	reader.onloadend=(function(event) {
    this._trackEvent('use', 'fileloaded');
		this.loadFile(event.target.result);
   
	}).bind(this);
  /////////////////////////////////////////////
  //currentfile=event.target.files[0].name;
  ///////////////////////////////////////////////
  //document.title=currentfile;
  //documentTitle(currentfile,selang,banyakhuruf)
  
  documentTitle(event.target.files[0].name,300,15);
  
  
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
/*    
    console.log('startTime '+this.midiPlayer.startTime);
    console.log('lastPlayTime '+this.midiPlayer.lastPlayTime);
    console.log(this.midiPlayer.events[this.midiPlayer.position].PlayTime);
    
*/
    
    
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
		//this.play();
	}).bind(this);
	oReq.send(null);

   /////////////////////////////////////////////
                                 //currentfile=url;
  ///////////////////////////////////////////////
  //document.title=currentfile;
                                 //documentTitle(url,300,15)
  
                                 //document.getElementById("current").innerHTML="<marquee>"+currentfile+"</marquee>";
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
	downloadFile("/sounds/"+event.target.value);
	//document.querySelector('select').addEventListener('change', selectFile);
};

Application.prototype.closePopin = function(event, params) {
  this._trackEvent('use', 'closepopin', params);
	document.getElementById(params).classList.remove('selected');
};


var app=new Application();

//module.exports = Application;

function documentTitle(CurrentTitle,selang,banyakhuruf){
  function MovingTitle(writeText, interval, visibleLetters) {
    
    var _instance = {};
    var lgt=0;
    lgt=writeText.length;
    var _currId = 0;
    var _numberOfLetters=0; 
    _numberOfLetters= lgt;

    function updateTitle() {
      document.title=null;
        _currId += 1;
        if(_currId > _numberOfLetters - 1) {
            _currId = 0; 
        }
        var startId=0; 
        var endId=0;
        var startId = _currId;
        endId = startId + visibleLetters;
        var finalText='';
        if(endId < _numberOfLetters - 1) {
            finalText = writeText.substring(startId, endId);
        } 
        else {
            var cappedEndId = 0;
            cappedEndId = _numberOfLetters;
            endId = endId - cappedEndId;

            finalText = writeText.substring(startId, cappedEndId) +     writeText.substring(0, endId);
        }

        document.title = finalText; 
    }

    _instance.init = function() {
        setInterval(updateTitle, interval);
    };

    return _instance;
  }
  
//var title = new MovingTitle("Desired title... ", 300, 10);
var s=0;s=selang;
var b=0;b=banyakhuruf;
var ct='';ct=CurrentTitle;
var title='';
title = new MovingTitle(ct+" ===== ", s, b);
title.init();
};
