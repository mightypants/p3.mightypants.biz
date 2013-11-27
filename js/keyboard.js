/****************************************************************************
setup audio elements and files; initialize keyboard options
****************************************************************************/
var notes = Array('C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B');
var octaveOffset = 1;

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
		$('#audioFiles').append('<audio id="'+ notes[i] + j +'" class="sound"><p>Your browser does not support the audio element </p></audio>');
		$('#audioFiles').append('<audio id="'+ notes[i] + j +'V" class="sound"><p>Your browser does not support the audio element </p></audio>');
	}
}

//load audio files with jwebaudio
$('.sound').each(function() {
	var url = 'audio/' + $(this).attr('id') + '.mp3';
	$(this).jWebAudio('addSoundSource', {
        'url': url,
        'volume': parseInt(100)
	});
    $(this).jWebAudio('load');
});

$('#octaveReadout').html(octaveOffset - 1);

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
	mapKeys(event.which, 'stop');
});

$('#octaveUp').click(function(){
	if(octaveOffset < 2) {
		octaveOffset++;
		$('#octaveReadout').empty();
		$('#octaveReadout').text(octaveOffset - 1);
	}
});

$('#octaveDown').click(function(){
	if(octaveOffset > 0) {
		octaveOffset--;
		$('#octaveReadout').html(octaveOffset - 1);
		stopAllNotes();
	}
});

/******************************************************************************************
load audio files
******************************************************************************************/



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

	if( !(!(compKeyID in keyMap)) ) {
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
		audioElID = pnoKeyID.split("_").pop() + noteOctave;
	}
	else{
		noteOctave = octaveOffset + 1;
		audioElID = pnoKeyID + octaveOffset;
	}
	

	if (action == 'play') {
		playNote(audioElID);
	}
	else {
		stopNote(audioElID);
	}	
}

/******************************************************************************************
play the audio file for the called note
******************************************************************************************/
function playNote(audioID) {
	console.log(audioID);
    $('#' + audioID).jWebAudio('play');
    $('#' + audioID + 'V').jWebAudio('play');
}

/******************************************************************************************
stop the audio file for the called note
******************************************************************************************/
function stopNote(audioID) {
	var vol = 100;

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
}

/******************************************************************************************
stop all audio files
******************************************************************************************/

function stopAllNotes(){
	$('.sound').each(function() {
    	$(this).jWebAudio('stop');
    	console.log(this);
});
}






