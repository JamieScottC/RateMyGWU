constructPage();
var reaLink = "";
//Injects everything into page
function constructPage(){
	//Loop through all the course rows
	$('.crseRow1').each(function(i, obj) {
		//Set currentTeacher
		var currentTeacher = $(this).children().eq(6);
		var teacherName = currentTeacher.text().substring(1, currentTeacher.text().indexOf(','));
		//Get the professor listing text from the course schedule
	  	var listing = currentTeacher.text();
	  	//Get the first letter of the first name from the course schedule
	  	var firstLetterCrse = listing.substring(listing.length - 1, listing.length);
		//Create tooltip
    	currentTeacher.addClass("tooltip");
    	currentTeacher.append("<div class='top'><h3>Not Avaiable</h3> <p>Overall Quality: 0<br>Level of Difficulty: 0<br>Would Take Again: 0%<br>Number of Ratings: 0</p> <i></i> </div>");
		//Construct the teacher rating information as well as add links to teacher name to RMP
		getInfo(teacherName, currentTeacher, firstLetterCrse);	
	});
}
//Constructs tooltip
//@param fullName the full name of the teacher
//@param currentTeacher the object pointing to the current listing we are at
function constructTooltip(fullName, currentTeacher, overall, difficulty, takeAgain, numRatings){
	var top = currentTeacher.find(".top");
	top.text("" + fullName);
}
//Retrieves link correct link from RMP and adds it to the teacher name. It also sets all the info for the tooltip
//@param name the name of the teacher we are trying to find the link for
//@param currentTeacher the object pointing to the current listing we are at
//@param firstLetterCrse The first letter of the teacher on the gw course schedule
function getInfo(name, currentTeacher, firstLetterCrse){
	//Find the link to professor page on RMP
	var searchLink = "https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=George+Washington+University&schoolID=353&query= " + name;
	var link = "";
	//Get the subject from the course schedule
	var label = currentTeacher.parent().children().eq(2).children().eq(1).attr('aria-label');
	//Message to find the ratings link
	chrome.runtime.sendMessage({searchLink: searchLink, firstLetterCrse: firstLetterCrse, label: label}, function(response){
		link = response.returnLink;
		//Add the link that directs user to RMP
		currentTeacher.wrapInner("<a href='" + link + "' target='_blank' />");
		console.log(response.fullName);
		constructTooltip(response.fullName, currentTeacher, response.overall, response.difficulty, response.takeAgain, response.numRatings);
	});
	}


