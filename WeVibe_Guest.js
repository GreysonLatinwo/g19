//Devon Kooker

//Guest functions page
var xhttp = new XMLHttpRequest();
var songList = [];      // this is where the songs will be listed
var userName = getCookie("Username");
var play_song = false;
var first_song_added = true;
var soundcloud_songs = true;
var firstThumbNail = "";

//initial run for setup
function initialize(){
    var ServerCode = document.getElementById("ServerCode");
    ServerCode.innerHTML += getCookie("PartyID");
    var input = document.getElementById("SongName");

    input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("Send").click();
    }
    });
    updateSongList();
   
}


//shows song being played
function showCurrentSong(){
        var container = document.getElementById('thumbnailContainer'); 
        container.innerHTML = "";
        if (songList.length > 0){ 
            $("#thumbnailContainer").append(
                container.insertAdjacentHTML('beforeend', '<img src="'+firstThumbNail.src+'"  alt="alt text" style="float: right" width="200"height="200"></img>')
            );

            var dropdownContainer = document.getElementsByClassName('dropdownContainer'); 
            dropdownContainer.innerHTML = "";
            var songParts_0 = songList[0].split(' ');
            $("#dropdownContainer").append(
                dropdownContainer.insertAdjacentHTML('beforeend','<a>test123</a>')
            );
        }
    
}


//updates page for songs in real time 
setInterval(function(){
    var tempList = [];
    $.get("getSongs", function(data) {
        //split on new lines
        var lines = data.split('\n');
        for(var i=0;i<lines.length;i++) {
            tempList.push(lines[i]);
        }
        
        if(arrayCheck(songList,tempList) == false){
            updateSongList();
            setTimeout(400);
        }
    });
},1000);



//Checks if info is correct and sends song
function sendSong(){
    
    //Checks if form items are correct
    var SongNameResult = checkTextBox(document.forms["WeVibeForm"]["SongName"].value);
    
    //Selects proper image according to the results
    var SongNameImage = getImage(Boolean(SongNameResult), "SongName");
    
    //Selects proper notification according to the results
    var labelNotifySong=getNotification(Boolean(SongNameResult), "SongName");
    
    //appends items
    document.getElementById("SongName").appendChild(SongNameImage);
    document.getElementById("SongName").appendChild(labelNotifySong);
    
    //Sends song if parameters are met
    
    if(SongNameResult == true ){
        setTimeout(function(){
            xhttp.open("POST", "WeVibe_Guest.html", true);
            xhttp.send("addSong " + document.forms["WeVibeForm"]["SongName"].value);

            //Area for sending song to Web Server
            document.forms["WeVibeForm"]["SongName"].value = "";
            document.getElementById("SongName").removeChild(SongNameImage); 
            updateSongList();          

        },200);

    }

}

//gets requirement notification
function getNotification(bool, ID) {
    var label = document.getElementById("labelNotify" + ID);
    if (label == null) {
        label = document.createElement("LABEL");
        label.id = "labelNotify" + ID;
        label.setAttribute( 'class', 'errorMessage' );
      }

      switch(ID) {
          case "SongName":
             label.innerHTML = bool ? "" : "Search is empty";
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
function checkTextBox(text) {
    if (text.length < 1) {
        valCheck = false;
        return false;
    }
    return true;
}

//updates displayed song list
function updateSongList() {   
    xhttp.open("GET", "getSongs", false);
    xhttp.send();

    let data = xhttp.responseText;
    
    songList = [];

    if(data === ' '){
        songParts = [];
        return;
    }
        
        
    var lines = data.split('\n');
    for(var i=0;i<lines.length;i++) {
        songList.push(lines[i]);
        if (first_song_added){
            play_song = true;
            first_song_added = false
        }
    }
            
    var container = document.getElementById('songContainer'); 
    container.innerHTML = "";
    firstThumbNail = getThumbNail(songList[0].split(' ')[3]);
    for(var i=0;i<songList.length;i++){
        var songParts = songList[i].split(' ');

        var songName = songParts[0].replace(/_/g, ' ');
        var originalSongName = songParts[0];
        var voteCount = songParts[1];
        var nameOfAdder = songParts[2];

        if(nameOfAdder.includes("host-")){
            nameOfAdder = "Host";
        }
        thumbNail = getThumbNail(songParts[3]);
        if(i == 0)
            $("#songContainer").append(
                container.insertAdjacentHTML( 
                    'beforeend', '<div id="box"><fieldset style="background-image:linear-gradient(to right,#4B0082, #6a0dad , #4B0082); border: 6px solid #2E0854; width: 500; align-items: center;  height: 60px;  bottom: 200px; border-radius: 13%;"><form id="SongForm" style="margin: 0 auto; text-align: center;"><p>Playing:'+ 
                    " " +
                    songName + " " + nameOfAdder + " " + voteCount +
                    " " +
                    '</p></form></fieldset></div>'
                )
                
            );
        else
            $("#songContainer").append(
                container.insertAdjacentHTML(
                    'beforeend', '<div id="box"><fieldset  style="width: 500; align-items: center;  height: 60px;  bottom: 200px; border-radius: 13%;"><form id="SongForm" style="margin: 0 auto; text-align: center;"><p>'+ 
                    " " +
                    songName + " " + nameOfAdder + " " + voteCount +
                    " " +
                    '<input style="font-family: verdana" type= "button" class="button" id="Upvote" name="Upvote" value="▲" onClick= sendVote1(this.id,"'+nameOfAdder+'","'+originalSongName+'",'+voteCount +'); />'+
                    " "+
                    '<input style="font-family: verdana" type="button" class= "button" id="Downvote" name="Downvote" value="▼" onClick= sendVote1(this.id,"'+nameOfAdder+'","'+originalSongName+'",'+voteCount +'); />'+
                    " "+
                    '<img src="'+thumbNail.src+'"  alt="alt text" style="float: right" width="'+thumbNail.width+'+"height="'+thumbNail.height+'"></img>'+
                    '</p></form></fieldset></div>'
                )
                
            );
        
    }
    showCurrentSong();                 
}



//Greyson Jones
//this would get the thumb nail if the website was https
function getThumbNail(songURL){
    songURL = "https://cors-anywhere.herokuapp.com/"+songURL
    thumbNail = null
    xhttp.open("GET", songURL, false);
    xhttp.send();
    html = xhttp.responseText;
    var link_url_index = html.indexOf('img src="');
    var beginning_url_index = html.indexOf('https://', link_url_index);
    var end_url_index = html.indexOf('\"', beginning_url_index);
    var thumbNail_link = html.substring(beginning_url_index, end_url_index);

    if (thumbNail_link != null) {
        thumbNail = new Image(50, 50);
        thumbNail.id = "image" + songURL;
        thumbNail.src = thumbNail_link;
        return thumbNail;
    }
}

// sets cookies
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

function arrayCheck(arr1, arr2) {

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]){
        return false;
         }
    }

    // Otherwise, return true
    return true;

}


//disconnects user from server
//Greyson Jones
function disconnect(){
    setTimeout(function(){
        xhttp.open("POST", "WeVibe_Guest.html", true);
        xhttp.send("disconnect");
        //alert("! Ending Party !");
        location.replace("WeVibe_Choose.html");
    },400);
}

function sendVote1(ID,name,songName,vote){
    var upvoted = false;
    var downvoted = false;
   
    switch(ID) {
		case "Upvote":
            setTimeout(function(){ 

                if(upvoted == true|| name == userName && vote>=1){ 
                    //alert("already upvoted");
                }
                else if(name == userName && vote<1){
                xhttp.open("POST", "WeVibe_Guest.html", true);
                if(vote<=-1){xhttp.send("vote " + songName + "=2");}
                else{xhttp.send("vote " + songName + "=1");}
                
                upvoted = true;
                //alert("upvoted own song");
                }
                else{
                xhttp.open("POST", "WeVibe_Guest.html", true);
                xhttp.send("vote " + songName + "=1");
                //alert("upvoted other's song");
                upvoted = true;
            }
		},100);
		break; 

		case "Downvote":
		setTimeout(function(){
            if(downvoted == true ||name == userName && vote<=-1){
                //alert("already downvoted");
            }
            else if(name == userName && vote>-1){
                xhttp.open("POST", "WeVibe_Guest.html", true);
                if(vote>=1){xhttp.send("vote " + songName + "=-2");}
                else{xhttp.send("vote " + songName + "=-1");}
              // alert("downvoted own song");
               downvoted = true;
            }
            else{
            xhttp.open("POST", "WeVibe_Guest.html", true);
            xhttp.send("vote " + songName + "=-1"); 
            //alert("downvoted other's song");
            downvoted = true;
            }
		},100);
		break;
    }

    
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
        pageHeight = $('#pageContainer').height();
        pageWidth = $('#pageContainer').width();
    }

    function scalePages(page, maxWidth, maxHeight) {            
        var scaleX = 1, scaleY = 1;                      
        scaleX = maxWidth / basePage.width;
        scaleY = maxHeight / basePage.height;
        basePage.scaleX = scaleX +.2;
        basePage.scaleY = scaleY+.2;
        basePage.scale = (scaleX > scaleY) ? scaleY : scaleX;

        var newLeftPos = Math.abs(Math.floor(((basePage.width * basePage.scale) - maxWidth)/2));
        var newTopPos = Math.abs(Math.floor(((basePage.height * basePage.scale) - maxHeight)/2));

        page.attr('style', '-webkit-transform:scale(' + basePage.scale + ');left:' + newLeftPos + 'px;top:' + newTopPos + 'px;');
    }
});


