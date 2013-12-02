/****************************************************************************
setup audio elements and files; initialize keyboard options
****************************************************************************/

var notes = Array('C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B');
var octaveOffset = 1;
var instruments = ['bass','epiano','marimba']
var currInstrument = instruments[1];

for(i in notes) {
	//notes C through F appear on the keyboard twice each, others only once
	//octave switcher will allow 2 additional octaves of each note
	var numOctavesOnKB;
	if (notes[i] == 'C' ||
		notes[i] == 'Cs' ||
		notes[i] == 'D' ||
		notes[i] == 'Ds' ||
		notes[i] == 'E' ||
		notes[i] == 'F' ) 
	{
		numOctavesOnKB = 4; //TODO: change these to 4, 3 when all octaves are enabled
	}
	else {
		numOctavesOnKB = 3;
	}

	for(j = 0; j < numOctavesOnKB; j++){
		$('#audioFiles').append('<audio id="'+ notes[i] + j + 'bass" class="sound"><p>Your browser does not support the audio element </p></audio>');
		$('#audioFiles').append('<audio id="'+ notes[i] + j + 'epiano" class="sound"><p>Your browser does not support the audio element </p></audio>');
		$('#audioFiles').append('<audio id="'+ notes[i] + j + 'marimba" class="sound"><p>Your browser does not support the audio element </p></audio>');
	}
}

//load audio files with jwebaudio
$('.sound').each(function() {
	var url = 'audio/' + $(this).attr('id') + '.mp3';
	$(this).jWebAudio('addSoundSource', {
        'url': url,
        'volume': parseInt(80)
	});
    $(this).jWebAudio('load');
});

$("#keyboard").fadeIn(800);


/****************************************************************************
event listeners
****************************************************************************/

$('.keyWhite,.keyBlack').mousedown(function(){	
	selectAudioEl(this.id, 'play');
});

$('body').keydown(function(){
	mapKeys(event.which, 'play');
});

$('body').keyup(function(){
	if(currInstrument != 'marimba') {
		mapKeys(event.which, 'stop');
	}
});

$('.btn_up,.btn_down').hover(function(){
	$(this).attr('src', 'images/' + $(this).attr('class') + '_hover.png');
},function(){
	$(this).attr('src', 'images/' + $(this).attr('class') + '.png');	
});

$('#octaveUp').click(function(){
	octaveUp();
});

$('#octaveDown').click(function(){
	octaveDown();
});

$('#instrumentUp').click(function(){
	nextInstrument();
});

$('#instrumentDown').click(function(){
	prevInstrument();
});

$(function() {
    $( ".draggable" ).draggable();
 });

$(".closeBtn").click(function(){
    hideHelp();
});

$("#helpIcon").click(function(){
    showHelp();
});


/****************************************************************************
show help panel
****************************************************************************/

function showHelp() {
	$("#help").animate({
    left:'50%',
    top:'250px',
    opacity:'1',
    height:'220px',
    width:'300px'
  	}, 'slow');
}


/****************************************************************************
hide help panel
****************************************************************************/

function hideHelp() {
	$("#help").animate({
    left:'0px',
    top:'0px',
    opacity:'.3',
    height:'10px',
    width:'10px'
  	}, 'slow', animateHelpIcon);
}

function animateHelpIcon() {
	$('#helpIcon').attr('src', 'images/help_hover.png');
	setTimeout(function(){
		$('#helpIcon').attr('src', 'images/help.png');
	}, 200);
}


/******************************************************************************************
change instruments
******************************************************************************************/

function nextInstrument() {
	i = instruments.indexOf(currInstrument);
	j = i < 2 ? i++ : i -= 2;
	currInstrument = instruments[i];
	$('#instrumentName').attr('src', 'images/' + currInstrument + '_txt.png');
	stopAllNotes();
}

function prevInstrument(){
	i = instruments.indexOf(currInstrument);
	j = i > 0 ? i-- : i += 2;
	currInstrument = instruments[i];
	$('#instrumentName').attr('src', 'images/' + currInstrument + '_txt.png');
	stopAllNotes();	
}


/******************************************************************************************
change octave incrementally
******************************************************************************************/

function octaveUp() {
	if(octaveOffset < 2) {
		octaveOffset++;
		octaveImgURL = 'images/oct_' + (octaveOffset - 1) + '.png';
		$('#octaveNum').attr('src', octaveImgURL);
		stopAllNotes();
	}
}

function octaveDown(){
	if(octaveOffset > 0) {
		octaveOffset--;
		octaveImgURL = 'images/oct_' + (octaveOffset - 1) + '.png';
		$('#octaveNum').attr('src', octaveImgURL);
		stopAllNotes();
	}
}


/******************************************************************************************
change octave to a specific number
******************************************************************************************/

function setOctave(compKeyID){
	octaveOffset = compKeyID - 53;
	octaveImgURL = 'images/oct_' + (octaveOffset - 1) + '.png';
	$('#octaveNum').attr('src', octaveImgURL);
}


/******************************************************************************************
when computer keyboard key is pressed, map to corresponding piano key div ID
******************************************************************************************/

function mapKeys(compKeyID, action){
	var keyMap = {
		65: 'C',
		87: 'Cs',
		83: 'D',
		69: 'Ds',
		68: 'E',
		70: 'F',
		84: 'Fs',
		71: 'G',
		89: 'Gs',
		72: 'A',
		85: 'As',
		74: 'B',
		75: 'up_C',
		79: 'up_Cs',
		76: 'up_D',
		80: 'up_Ds',
		186: 'up_E',
		222: 'up_F' 
	};


	if (compKeyID == 53 || compKeyID == 54 || compKeyID == 55) {
		setOctave(compKeyID);
	}
	else if (compKeyID in keyMap) {
		selectAudioEl(keyMap[compKeyID], action);
	}

}


/******************************************************************************************
select the appropriate audio element to play or stop, based on current note, octave, etc.
******************************************************************************************/

function selectAudioEl(pnoKeyID, action){
	var noteOctave;
	var audioElID;

	if(pnoKeyID.search('up') != -1){
		noteOctave = octaveOffset + 1;
		audioElID = pnoKeyID.split("_").pop() + noteOctave + currInstrument;
	}
	else{
		noteOctave = octaveOffset + 1;
		audioElID = pnoKeyID + octaveOffset + currInstrument;
	}
	

	if (action == 'play') {
		playNote(audioElID, pnoKeyID);
	}
	else {
		stopNote(audioElID, pnoKeyID);
	}	
}


/******************************************************************************************
play the audio file for the called note, highlight the key on the keyboard
******************************************************************************************/

function playNote(audioID, pnoKeyID) {
    $('#' + audioID).jWebAudio('play');
    $('#' + pnoKeyID).css('opacity',.7);

    if(currInstrument == 'marimba') {
    	setTimeout(stopNote(audioID, pnoKeyID), 1000);
    	//console.log('stop you stupid marimba');
    }
}


/******************************************************************************************
stop the audio file for the called note, remove highlight from played key
******************************************************************************************/

function stopNote(audioID, pnoKeyID) {
	var vol = 80;

	//do short fadeout when stopping the note to avoid pops
	var fadeOut = setInterval(
		function(){
			if (vol > 10) {
				vol -= 12;
			}
			else {
				vol--;
			}

			if (vol > 0){
				$('#' + audioID).jWebAudio('options', {
	    			'volume': parseInt(vol),
				});
			}
			else {
				$('#' + audioID).jWebAudio('stop');
				$('#' + audioID).jWebAudio('options', {
	    			'volume': parseInt(100),
				});
				clearInterval(fadeOut);
			}
		}, 
		1 //miliseconds for setInterval
	);

	$('#' + pnoKeyID).css('opacity',0);

}


/******************************************************************************************
stop all audio files
******************************************************************************************/

function stopAllNotes(){
	$('.sound').each(function() {
    	$(this).jWebAudio('stop');
});
}




