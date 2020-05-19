//Devon Kooker

//Choose functions page
var xhttp = new XMLHttpRequest();

//Directs Clients to either Host Page or Guest Login
function clientDirector(ID) {

	switch(ID) {
		case "HostButton":
		setTimeout(function(){

			/** AREA TO TELL WEB SERVER TO MAKE NEW SERVER THREAD **/
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					ID = xhttp.responseText;
					console.log(ID);
					setCookie("PartyID", ID);
					setCookie("Username", "host-"+ID);
					location.replace('WeVibe_Host.html');
				}
			};
			
			xhttp.open("GET", "host", true);
			xhttp.send();
		},500);
		break;

		case "GuestButton":
		setTimeout(function(){
			location.replace("WeVibe_GuestLogin.html");
		},500);
		break;
	}
}
function setCookie(cname,cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}
var pageWidth, pageHeight;

var basePage = {
	width: 500,
	height: 500,
	scale: 1,
	scaleX: 1,
	scaleY: 1
  };


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