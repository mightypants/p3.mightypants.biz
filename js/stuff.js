function Person(fname, lname){
	var numPlayers = 0;
	numPlayers++;

	Person.getNumPlayers = function(){
		console.log(numPlayers);
	};

	this.fname = fname;
	this.lname = lname;
	this.printName = function() {
		console.log(this.fname + ' ' + this.lname);
	};
};

function Rectangle(name,w,h,color) {
	this.name = name;
	this.width = w;
	this.height = h;
	this.color = color;

	this.addToPage = function(){

		$('#bucket').append('<div id="' + this.name + '">text</div>');
		$('#' + this.name).css({
			"background-color":this.color,
			"height":this.height,
			"width":this.width
		});
	};

	this.hide = function(){
		$('#' + this.name).hide(2000);
	}
};

$(".key").click(function(){
	$(this).css({
		"background-color": "#689"
	});
});