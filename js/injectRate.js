constructPage();

//Injects everything into page
function constructPage(){
	//Loop through all the course rows
	$('.crseRow1').each(function(i, obj) {
		//Set currentTeacher
		var currentTeacher = $(this).children().eq(6);
		//Add a link to RMP
    	currentTeacher.wrapInner("<a href='' target='_blank' />");
		//Create tooltip
    	currentTeacher.addClass("tooltip");
    	currentTeacher.append("<div class='top'><h3>Lorem Ipsum</h3> <p>Dolor sit amet, consectetur adipiscing elit.</p> <i></i> </div>");
    	getTeacher(currentTeacher.children().eq(0).text().substring(0, currentTeacher.children().eq(0).text().indexOf(',')), currentTeacher);
	});
}
//Creates an object for a teacher with all their ratings
//@param name the name of the teacher we are creating
//@param currentTeacher the object pointing the the current listing we are at
//@returns a teacher object that has all their ratings
function getTeacher(name, currentTeacher){
	var firstName = '';
	var overall = 0;
	var difficulty = 0;
	var takeAgain = 0;
	var link = getLink(name, currentTeacher);
	//Perform get request for html for teacher page
	$.get(link, function(data) {
  		//Lets convert the the string to html so we can read it w jquery
  		var html = $(data);
  		
	});
	var teacher = {
		firstName: firstName,
		lastName: name,
		overall: overall,
		difficulty: difficulty,
		takeAgain: takeAgain
	};
	return teacher;
}
//Retrieves link correct link from RMP
//@param name the name of the teacher we are trying to find the link for
//@param currentTeacher the object pointing to the current listing we are at
//@returns the correct link for RMP
function getLink(name, currentTeacher){
	var link = "https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=George+Washington+University&schoolID=353&query=" + name;
	//Perform get request for html
	$.get(link, function(data) {
  		//Lets convert the the string to html so we can read it w jquery
  		var html = $(data);
  		//Find the link to professor page on RMP
  		var id = "";
  		//Cycle through every listing on RMP until we are sure we found the matching professor
  		$(".listing.PROFESSOR", data).each(function(i, obj){
  			//Get the full name from RMP
  			console.log($(this).children().eq(0).children().eq(1).children().eq(0).text());
  			var fullName = $(this).children().eq(0).children().eq(1).children().eq(0).text();
  			//Get the first letter of the first name from RMP
  			var firstLetterRMP = fullName.substring(fullName.indexOf(',') + 2, fullName.indexOf(',') + 3);
  			//Get the professor listing text from the course schedule
  			var listing = currentTeacher.children().eq(0).text();
  			//Get the first letter of the first name from the course schedule
  			var firstLetterCrse = listing.substring(listing.length - 1, listing.length);
  			//Get the subject from the course schedule
  			var label = currentTeacher.parent().children().eq(2).children().eq(1).attr('aria-label');
  			var subjectCrse = subject[label.substring(0, label.indexOf(' '))];
  			//Get the subject from RMP
  			var sub = $(this).children().eq(0).children().eq(1).children().eq(1).text();
  			var subjectRMP =  sub.substring(sub.indexOf(',') + 2);
  			//Now lets check if the first letter of the first name matches the first name on the course schedule
  			//Also lets make sure they teach the same subject
  			if((firstLetterCrse === firstLetterRMP) && (subjectCrse === subjectRMP)){
  				//If we found the right professor lets get the id for their ratings page
  				id = $(this).children().eq(0).attr('href');
  				link = "https://www.ratemyprofessors.com" + id;
  				return link;
  			}
  		});
	});

}

//Map to convert course schedule subject to RMP subject
const subject = {
	"ACA": "THEATRE AMP DANCE",
	"ACCY": "ACCOUNTING",
	"AMST": "",
	"ANAT": "",
	"ANTH": "",
	"APSC": "",
	"ARAB": "",
	"AH": "",
	"ASTR": "",
	"BIOC": "",
	"BISC": "",
	"BME": "",
	"BMSC": "",
	"BIOS": "",
	"BADM": "",
	"CANC": "",
	"CAMA": "",
	"CHEM": "",
	"CHIN": "",
	"CE": "",
	"CLAS": "",
	"CCAS": "",
	"COMM": "",
	"CSCI": "",
	"CAH": "",
	"CCE": "",
	"CDE": "",
	"CFN": "",
	"CPJ": "",
	"CSA": "",
	"CNSL": "",
	"CPED": "",
	"DATS": "",
	"DNSC": "",
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
