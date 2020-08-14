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
		setLink(teacherName, currentTeacher, firstLetterCrse);	
	});
}
//Creates an object for a teacher with all their ratings
//@param link the link to the ratings page
//@param fullName the full name of the teacher
//@param currentTeacher the object pointing to the current listing we are at
function setRating(link, fullName, currentTeacher){
	var overall = 0;
	var difficulty = 0;
	var takeAgain = 0;
	var numRatings = 0;
	//Check to see if the teacher was available on RMP
	if(link === "NOT_AVAILABLE"){
		return;
	}

	//Perform get request for html for teacher page
	$.ajax({
		type: "GET",
		url: link,
		success: function(data){
	  		//Lets convert the the string to html so we can read it w jquery
	  		var html = $(data);
	  		//Find all the data we need to construct the tooltip
	  		overall = $(".RatingValue__Numerator-qw8sqy-2", data).text();
	  		difficulty = $("FeedbackItem__FeedbackNumber-uof32n-1", data).text();
	  		takeAgain = $("FeedbackItem__FeedbackNumber-uof32n-1", data).text();
	  		numRatings = $("RatingValue__NumRatings-qw8sqy-0" ,data).children().eq(0).children().eq(0).text();
	  		//Construct the tooltip
	  		var top = currentTeacher.find(".top");
	  		console.log(top.text());
	  		top.text("" + fullName);
	  		console.log(top.text());
  		}
	});
}
//Retrieves link correct link from RMP and adds it to the teacher name. It also sets all the info for the tooltip
//@param name the name of the teacher we are trying to find the link for
//@param currentTeacher the object pointing to the current listing we are at
//@param firstLetterCrse The first letter of the teacher on the gw course schedule
function setLink(name, currentTeacher, firstLetterCrse){
	//Find the link to professor page on RMP
	var searchLink = "https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=George+Washington+University&schoolID=353&query= " + name;
	var link = "";
	//Perform get request for html
	$.ajax({
		type: "GET",
		url: searchLink,
		success: function(data){ 
	  		//Lets convert the the string to html so we can read it w jquery
	  		var html = $(data);
	  		var id = [];
	  		var teacherCount = 0;
	  		var subjects = [];
	  		var fullName = "";
	  		//Cycle through every listing on RMP until we are sure we found the matching professor
	  		$(".listing.PROFESSOR", data).each(function(i, obj){
	  			//Get the full name from RMP
	  		    fullName = $(this).children().eq(0).children().eq(1).children().eq(0).text();
	  			//console.log(name + " " + fullName + " " + searchLink);
	  			//Get the first letter of the first name from RMP
	  			var firstLetterRMP = fullName.substring(fullName.indexOf(',') + 2, fullName.indexOf(',') + 3);
	  			//Now lets check if the first letter of the first name matches the first name on the course schedule
	  			//We also want to check if there are two professors with the same last name and same first name
	  			if(firstLetterCrse === firstLetterRMP){
	  				teacherCount++;
	  				//If we found a viable  professor lets store the id for their ratings page
	  				id[teacherCount] = $(this).children().eq(0).attr('href');
	  				//Lets also store their subject incase if we have to narrow down the viable professors
	  				//Get the subject from RMP
	  				var sub = $(this).children().eq(0).children().eq(1).children().eq(1).text();
	  				var subjectRMP =  sub.substring(sub.indexOf(',') + 2).toUpperCase();
	  				subjects[teacherCount] = subjectRMP;
	  			}
	  		});
						if(teacherCount > 0){
				//Lets see if we found multiple viable professors 
				if(teacherCount > 1){
					//Then we have to compare subjects to narrow it down because GW doesnt give the full teacher name on the course schedule :/
					//Get the subject from the course schedule
	  				var label = currentTeacher.parent().children().eq(2).children().eq(1).attr('aria-label');
	  				var subjectCrse = subject[label.substring(0, label.indexOf(' '))];
	  				//console.log(subjectCrse);
	  				//console.log(subjects[2]);
	  				for(i = 1; i <= teacherCount; i++){
	  					if(subjects[i] == subjectCrse){
	  						//We got the right professor
	  						link = "https://www.ratemyprofessors.com" + id[i];
	  						
	  					}
	  				}
				}else{
					//Otherwise if there is just 1 viable professor we found the right one!
	  				link = "https://www.ratemyprofessors.com" + id[1];
	  			}	
			}else{
				link = "NOT_AVAILABLE";			
			}
			//Add the link to RMP
	  		currentTeacher.wrapInner("<a href='" + link + "' target='_blank' />");
	  		//Set the ratings info on gw course schedule
	  		setRating(link, fullName, currentTeacher);
			}
		});
	}


//Map to convert course schedule subject to RMP subject
const subject = {
	"ACA": "THEATRE",
	"ACCY": "ACCOUNTING",
	"AMST": "AMERICAN STUDIES",
	"ANAT": "BIOLOGY",
	"ANTH": "ANTHROPOLOGY",
	"APSC": "ENGINEERING",
	"ARAB": "ARABIC",
	"AH": "ART HISTORY",
	"ASTR": "ASTRONOMY",
	"BIOC": "BIOCHEMISTRY",
	"BISC": "BIOLOGY",
	"BME": "ENGINEERING",
	"BMSC": "BIOLOGY",
	"BIOS": "BIOLOGY",
	"BADM": "BUSINESS",
	"CANC": "BIOLOGY",
	"CAMA": "FINANCE",
	"CHEM": "CHEMISTRY",
	"CHIN": "CHINESE",
	"CE": "ENGINEERING",
	"CLAS": "CLASSICS",
	"CCAS": "COUNSELING",
	"COMM": "COMMUNICATION",
	"CSCI": "COMPUTER SCIENCE",
	"CAH": "ART HISTORY",
	"CCE": "DESIGN",
	"CDE": "DESIGN",
	"CFN": "COUNSELING",
	"CPJ": "JOURNALISM",
	"CSA": "FINE ARTS",
	"CNSL": "COUNSELING",
	"CPED": "INSTRUCTION",
	"DATS": "COMPUTER SCIENCE",
	"DNSC": "COMPUTER SCIENCE",
	"EALL": "",
	"ECON": "",
	"EDUC": "",
	"ECE": "",
	"EHS": "",
	"ENGL": "",
	"EAP": "",
	"EMSE": "",
	"ENRP": "",
	"ENVR": "",
	"EPID": "",
	"EXNS": "",
	"FILM": "",
	"FINA": "",
	"FORS": "",
	"FREN": "",
	"GTCH": "",	
	"GENO": "",
	"GEOG": "",
	"GEOL": "",
	"GER": "",
	"GCON": "",
	"SEHD": "",
	"GREK": "",
	"HSCI": "",
	"HLWL": "",	
	"HSML": "",
	"HEBR": "",
	"HIST": "",
	"HOMP": "",
	"HONR": "",
	"HDEV": "",
	"HOL": "",
	"HSSJ": "",
	"ISTM": "",	
	"IDIS": "",
	"IA": "",
	"IAFF": "",
	"IBUS": "",
	"ITAL": "",
	"JAPN": "",
	"JSTD": "",
	"KOR": "",
	"LATN": "",	
	"LSPA": "",
	"MGT": "",
	"MKTG": "",
	"MBAD": "",
	"MATH": "",
	"MAE": "",
	"MICR": "",
	"MMED": "",
	"MUS": "",	
	"NSC": "",
	"NRSC": "",
	"ORSC": "",
	"PATH": "",
	"PSTD": "",
	"PERS": "",
	"PHAR": "",
	"PHIL": "",
	"PT": "",	
	"PA": "",
	"PHYS": "",
	"PHYL": "",
	"PMGT": "",
	"PPSY": "",
	"PSC": "",
	"PORT": "",
	"PSAD": "",
	"PSYD": "",	
	"PSYC": "",
	"PUBH": "",
	"PPPA": "",
	"REL": "",
	"SEAS": "",
	"SMPA": "",
	"SLAV": "",
	"SOC": "",
	"SPAN": "",	
	"SPED": "",
	"SLHS": "",
	"STAT": "",
	"SMPP": "",
	"SUST": "",
	"TSAP": "",
	"TRDA": "",
	"TSTD": "",
	"UNIV": "",	
	"UW": "",	
	"WLP": "",	
	"WGSS": ""
};
