constructPage();
function constructPage(){
	//Loop through all the course rows
	$('.crseRow1').each(function(i, obj) {
		//Add a link to RMP
    	$(this).children().eq(6).wrapInner("<a href='' target='_blank' />");
		//Create tooltip
    	$(this).children().eq(6).addClass("tooltip");
    	$(this).children().eq(6).append("<div class='top'><h3>Lorem Ipsum</h3> <p>Dolor sit amet, consectetur adipiscing elit.</p> <i></i> </div>");
	});
	getLink("Page");
}

/*function getTeacher(name){
	var link = getLink(name);

	var teacher = {
		firstName: ,
		lastName: name,
		overall: ,
		difficulty: ,
		takeAgain: 
	};
}*/

function getLink(name){
	var link = "https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=George+Washington+University&schoolID=353&query=" + name;
	$.get(link, function(data) {
  		console.log(data);
	});
}