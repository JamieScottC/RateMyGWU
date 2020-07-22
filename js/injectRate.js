console.log("Testing");
constructPage();
function constructPage(){
	//Loop through all the course rows
	$('.crseRow1').each(function(i, obj) {
    	console.log($(this).children().eq(6));
    	$(this).children().eq(6).addClass("tooltip");
    	$(this).children().eq(6).append("<div class='top'><h3>Lorem Ipsum</h3> <p>Dolor sit amet, consectetur adipiscing elit.</p> <i></i> </div>")
	});

}