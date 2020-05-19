//Devon Kooker

//Guest Login functions page
var xhttp = new XMLHttpRequest();
var serverList = [];    // this is where the server codes are listed
var PartyCode = "party_code";       // this is where the entered party code is listed
var Username = "";                  // this is where the entered username is listed

function initialize(){
    if(performance.navigation.type == 1){
        location.replace("WeVibe_Choose.html");
    }
}

//Validates entered info and directs user to guest page
function guestValidate() {
    codeCheck1 = true;
    codeCheck2 = true;

  //Checks if Page Items are correct are correct
    var nameResult = checkUserName(document.forms["WeVibeForm"]["Username"].value);
    var partyCodeResult = checkPartyCode(document.forms["WeVibeForm"]["PartyCode"].value);
	
	//Selects proper image according to the results
    var partyCodeImage = getImage(Boolean(partyCodeResult), "PartyCode");
  	var nameImage= getImage(Boolean(nameResult), "Username");
	
	//Selects proper notification according to the results
    var partyCodeNotify=getNotification(Boolean(partyCodeResult), "PartyCode");
	  var nameNotify=getNotification(Boolean(nameResult), "Username");
	
	//appends items
    document.getElementById("PartyCode").appendChild(partyCodeImage);
    //document.getElementById("PartyCode").appendChild(partyCodeNotify);
	
	 document.getElementById("Username").appendChild(nameImage);
    //document.getElementById("Username").appendChild(nameNotify);


	//enters next page if all form items are checked
	if(partyCodeResult == true && nameResult == true){
        partyCode = document.forms["WeVibeForm"]["PartyCode"].value;
        userName = document.forms["WeVibeForm"]["Username"].value;
	setTimeout(
        function(){
            setCookie("PartyID",partyCode);
            setCookie("Username", userName);
			      hashCode = Math.floor(Math.random() * 100001);
            setCookie("HashID", hashCode)


            //set user name
            xhttp.open("POST", "WeVibe_GuestLogin.html", true);
            xhttp.send("client " + partyCode + " " + Username);
            location.replace("WeVibe_Guest.html" );
    },1050);
	}

}

//gets requirement notification
function getNotification(bool, ID) {
    var label = document.getElementById("labelNotify" + ID);
    if (label == null) {
        label = document.createElement("LABEL");
        label.id = "labelNotify" + ID;
        // label.className = "errorMessage";
        label.setAttribute( 'class', 'errorMessage' );
       
      }

	  switch(ID) {
		  case "PartyCode":

        //label.innerHTML = bool ? "" : "Name can't be empty";
             if(codeCheck1)label.innerHTML = bool ? "" : "Code can't be empty";
             else if(codeCheck2)label.innerHTML = bool ? "" : "Couldn't find party";
            
			break;
		  case "Username":
			 label.innerHTML = bool ? "" : "Name can't be empty";
			break;
	    }
	  
    return label;
}

//gets requirement image
function getImage(bool, ID) {
  var image = document.getElementById("image" + ID);
  if (image == null) {
      image = new Image(15, 15);
      image.id = "image" + ID;
  }
  image.src = bool ? './correct.png' : './wrong.png';
  return image;
}

//checks if text box meets requirements
function checkPartyCode(text) {
  if(text.length < 1){
    codeCheck1 = true;
    return false;
  }
  
    xhttp.open("GET", "join?"+text, false);
    xhttp.send();  

    let res = xhttp.responseText;
    console.log(res);
    if(res === "true"){
      return true;
    }
    else{
      codeCheck2 = false;
      return false;
    }
    
}

//checks if username meets requirements
function checkUserName(text) {
    if (text.length < 1 ) {
        return false;
    }
    Username = text;
    setCookie("Username", Username)
    return true;
}

//sets cookies
function setCookie(cname,cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

//gets cookies
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}



//*** AREA FOR SCALING SCREEN ITEMS ***//

var pageWidth, pageHeight;



var basePage = {
  width: 500,
  height: 500,
  scale: 1,
  scaleX: 1,
  scaleY: 1
};

$(function(){
  var $page = $('.page_content');
  
  getPageSize();
  scalePages($page, pageWidth, pageHeight);
  
  //using underscore to delay resize method till finished resizing window
  $(window).resize(_.debounce(function () {
    getPageSize();            
    scalePages($page, pageWidth, pageHeight);
  }, 150));
  

function getPageSize() {
  pageHeight = $('#container').height();
  pageWidth = $('#container').width();
}

function scalePages(page, maxWidth, maxHeight) {            
  var scaleX = 1, scaleY = 1;                      
  scaleX = maxWidth / basePage.width;
  scaleY = maxHeight / basePage.height;
  basePage.scaleX = scaleX;
  basePage.scaleY = scaleY;
  basePage.scale = (scaleX > scaleY) ? scaleY : scaleX;

  var newLeftPos = Math.abs(Math.floor(((basePage.width * basePage.scale) - maxWidth)/2));
  var newTopPos = Math.abs(Math.floor(((basePage.height * basePage.scale) - maxHeight)/2));

  page.attr('style', '-webkit-transform:scale(' + basePage.scale + ');left:' + newLeftPos + 'px;top:' + newTopPos + 'px;');
}
});