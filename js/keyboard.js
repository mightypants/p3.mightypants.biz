/****************************************************************************
setup audio files
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
		numOctavesOnKB = 4;
	}
	else {
		numOctavesOnKB = 3;
	}

	for(j = 0; j < numOctavesOnKB; j++){
		console.log(notes[i] + j);
		$('#audioFiles').append('<audio id="'+ notes[i] + j + 'audio' +'" src="audio/' + notes[i] + j + '.mp3" preload="auto"><p>Your browser does not support the audio element </p></audio>');
	}
}

$('.keyWhite,.keyBlack').click(function(){
	
	buildAudioElID(this.id);
});

$('input').keypress(function(){
	playNote('C1audio');
});

$('input').keyup(function(){
	pauseNote('C1audio');
});


function buildAudioElID(pKeyID){
	var noteOctave;
	var audioElID;

	if(pKeyID.search('up') != -1){
		noteOctave = octaveOffset + 1;
		audioElID = pKeyID.split("_").pop() + noteOctave + 'audio';
	}
	else{
		noteOctave = octaveOffset + 1;
		audioElID = pKeyID + octaveOffset + 'audio';
	}
	console.log(audioElID);
	playNote(audioElID);

	//console.log(pKey.id);
	//console.log(pKey.parentNode.id);

	//console.log(pKey.id.split("_").pop());
}

function playNote(id){
	console.log(id);
	document.getElementById(id).play();
}

function pauseNote(id){
	console.log(id);
	document.getElementById(id).pause();
}