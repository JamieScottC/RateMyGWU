console.log("dot");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	//RMP search page----
  	var searchLink = request.searchLink;
  	var firstLetterCrse = request.firstLetterCrse;
  	var label = request.label;
  	var link = "";
  	var fullName = "";
     $.ajax({
		type: "GET",
		url: request.searchLink,
		success: function(data){ 
	  		//Lets convert the the string to html so we can read it w jquery
	  		var html = $(data);
	  		var id = [];
	  		var teacherCount = 0;
	  		var subjects = [];
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
	  				var subjectCrse = subject[label.substring(0, label.indexOf(' '))];
	  				//console.log(subjectCrse);
	  				//console.log(subjects[2]);
	  				for(i = 1; i <= teacherCount; i++){
	  					if(subjects[i].includes(subjectCrse)){
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
			//RMP ratings page----
		  	var overall = 0;
		  	var difficulty = 0; 
		  	var takeAgain = 0;
		  	var numRatings = 0;
			//Perform get request for html for teacher page
			if(link === "NOT_AVAILABLE"){
				sendResponse({returnLink: link, overall: 0, difficulty: 0, takeAgain: 0, numRatings: 0, fullName: "Not Available"});
			}
			if(link != "NOT_AVAILABLE"){
				$.ajax({
					type: "GET",
					url: link,
					success: function(data){
				  		//Lets convert the the string to html so we can read it w jquery
				  		var html = $(data);
				  		//Find all the data we need to construct the tooltip
				  		overall = $(".RatingValue__Numerator-qw8sqy-2", data).text();
				  		console.log("hello!" + overall);
				  		difficulty = $("FeedbackItem__FeedbackNumber-uof32n-1", data).text();
				  		takeAgain = $("FeedbackItem__FeedbackNumber-uof32n-1", data).text();
				  		numRatings = $("RatingValue__NumRatings-qw8sqy-0" ,data).children().eq(0).children().eq(0).text();
				  		sendResponse({returnLink: link, overall: overall, difficulty: difficulty, takeAgain: takeAgain, numRatings: numRatings, fullName: fullName});
			  		}
				});
			}
		}
	});
	return true;
  });
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


