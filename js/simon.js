
	
	/*-------------------------------------------------------------------------------------------------
	Notes:
	http://caniuse.com/audio
	https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
	https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
	-------------------------------------------------------------------------------------------------*/

	/*-------------------------------------------------------------------------------------------------
	Variables
	-------------------------------------------------------------------------------------------------*/
	// 1d array of colors; will be built off of the 2d array "sounds"
	var colors    = Array();
	
	// Will store the sequence the computer has built
	var sequence  = Array();
	
	// Where the player is in the current sequence they're playing
	var player_cursor = 0;
	
	// Where the computer is in the sequence
	var sequence_cursor = 0;
	
	// A set interval timer	
	var timer;
		
	// Define sounds
	var sounds = Array(
		Array('green','KIK_2'),
		Array('yellow','KIK_3'),
		Array('red','KIK_4'),
		Array('blue','KIK_7')
	);

	/*-------------------------------------------------------------------------------------------------
	Setup
	-------------------------------------------------------------------------------------------------*/
	// Set up audio files and buttons
	for(i in sounds) {
		
		var color = sounds[i][0];
		var sound = sounds[i][1];
	
		// Initiate the 1d color array
		colors.push(color);
	
		// Generate the audio files and the bars
		$('#audio_files').append('<audio id="'+ color +'" src="../wavs/' + sound + '.wav" preload="auto"><p>Your browser does not support the audio element </p></audio>');
		$('#buttons').append("<div id='bar-" + color + "' class='bar " + color + "' data-color='" + color + "'></div>");
	}
	
	
	/*-------------------------------------------------------------------------------------------------
	Event listeners
	-------------------------------------------------------------------------------------------------*/
	$('.bar').click(function() {
		pressed_color($(this).attr('data-color'));
	});
	
	$('#game-over').click(function() {
		location.reload();		
	});
	
	
	/*-------------------------------------------------------------------------------------------------
	Start the game on page load
	-------------------------------------------------------------------------------------------------*/
	next_sequence();
	
	
	/*-------------------------------------------------------------------------------------------------
	When the user presses a color...
	-------------------------------------------------------------------------------------------------*/
	function pressed_color(color) {
				
		// If they've hit the correct color in the sequence...
		if(sequence[player_cursor] == color) {

			// Play the sound
			play_sound(color);
			
			// Move them forward in the sequence...
			player_cursor++;
			
			// If they're at the end of the sequence...
			if(player_cursor == sequence.length) {
				
				// Reset for next time...
				player_cursor   = 0;
				sequence_cursor = 0;
				
				// Wait a sec, then initiate the next sequence
				setTimeout(next_sequence,500);
			}
			
		}
		// If they've hit an incorrect color -> Game over :(
		else {
			$('#game-over').show();
		}
		
		
	}
	
	
	/*-------------------------------------------------------------------------------------------------
	When the player reaches the end of the sequence, time to pick a new color
	-------------------------------------------------------------------------------------------------*/
	function next_sequence() {

		// Pick a new color
		var random_color = pick_random_color();
		
		// Add it to the sequence
		sequence.push(random_color);
		
		console.log("New Sequence:" + sequence);
		
		// About to play the new sequence, so put up the dont-click-screen
		$('#screen').show();
		
		// Start the loop that will go through the sequence
		timer = setInterval(play_a_note_in_the_sequence,500);
			
	}
	
	
	/*-------------------------------------------------------------------------------------------------
	
	-------------------------------------------------------------------------------------------------*/
	function play_a_note_in_the_sequence() {
	
		// What color are we at?
		var this_color = sequence[sequence_cursor];
		
		// Play it...
		play_sound(this_color);
		
		// Proceed forward...
		sequence_cursor++;
		
		// If we're at the end of the sequence
		if(sequence_cursor == sequence.length) {
		
			// Kill the loop
			clearInterval(timer);
			
			// Turn off the dont-click-screen
			$('#screen').hide();
			
			console.log("Waiting for player move");
		}
		
	}
	
	
	/*-------------------------------------------------------------------------------------------------
	Triggered by the sequencer, and also the player
	-------------------------------------------------------------------------------------------------*/
	function play_sound(color) {
		
		// Trigger the audio file
		// First make sure this color is stopped, just in case we get ahead of ourselves
		document.getElementById(color).pause();
		// Then play
		document.getElementById(color).play();
		
		// Make it bright
		$('#bar-' + color).css('opacity',1);
		
		// Wait a hair of a second, then make it dim again
		setTimeout(function() {
			$('#bar-' + color).css('opacity',.5);
		},250);
		
	}
	
	
	/*-------------------------------------------------------------------------------------------------
	Helper function - returns a random color from the 1d array of colors
	-------------------------------------------------------------------------------------------------*/
	function pick_random_color() {
	
		// Figure out the last color
		var last       = sequence.length - 1;
		var last_color = sequence[last];
		
		// Choose a new color
		var random     = Math.floor((Math.random()*4)+0);
		var new_color  = colors[random];
		
		// Make sure new color does not match last color
		if(new_color == last_color) {
			console.log('Duplicate; pick a new color');
			return pick_random_color();
		}
		
		return new_color;
	}
	
	