var baseURL = "https://www.contadordeinscritos.org/";

if (typeof isEmbed == 'undefined') isEmbed = 1;
/*if (window.location.hostname != "localhost" && 1) {
  if (window.location.protocol != "https:") window.location.replace("https:" + window.location.href.substring(window.location.protocol.length));
  if (location.hostname.indexOf("subscribercount.net") == -1) window.location.replace(baseURL + location.hash);
  if ((window.top !== window.self) && isEmbed == 0) window.top.location.replace(window.self.location.href);
  if ((window.top == window.self) && isEmbed) window.top.location.replace(baseURL + location.hash);
}*/
/*var console = {};
console.log = function(){};*/

var coolGuys = ['UCV306eHqgo0LvBf3Mh36AHg'];
// var APIkeys = ["AIzaSyC0QYUSKEwHaRVz4NKpT1SLbkVMT1o5cM8"];
var APIkeys = ["AIzaSyBlXF4_B1dR0JJTNCGsozSoLIY1mbiiPa8"];
var username = coolGuys[Math.floor(Math.random() * coolGuys.length)];
var rawInput = username;
var keyIndex = 0;
var darkTheme;
var soundNotPlayed = false;
var channelId;
var channelParam = false;
var shareURL;
var interval;

console.log("array api key lenght" + APIkeys.length);
Array.prototype.shuffle = function() {
  var i = this.length,
    j, temp;
  if (i == 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
}
APIkeys.shuffle();

function playSongTada(){
	var audio = new Audio('http://contadordeinscritos.org/assets/song/TaDa.mp3');
audio.play();
}


var getText = function(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) callback(request.responseText);
      else {
        callback("nex");
      }
    }
  };
  request.open('GET', url);
  request.send();
}
var changeText = function(elem, changeVal) {
  if ('textContent' in elem) {
    elem.textContent = changeVal;
  } else {
    elem.innerText = changeVal;
  }
}
var hasClass = function(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
var addClass = function(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}
var removeClass = function(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
var readStorage = function() {
	if(localStorage.getItem("darkTheme") == 'true') toggleDark();
	if(localStorage.getItem("milestone") == 'true') toggleMilestones();
	if(localStorage.getItem("immersive") == 'true') toggleImmersive();
}
var toggleDark = function() {
	var html = document.body.parentElement;
	if(hasClass(html, 'dark')) {
		removeClass(html, 'dark');
		addClass(document.querySelector("#CountSubChannel"),'pure-g');
		//showElements();
		darkTheme.checked = false;
	} else {
		removeClass(document.querySelector("#CountSubChannel"),'pure-g');
		//hideElements();
		addClass(html, 'dark');
		
		darkTheme.checked = true;
	}
	localStorage.setItem("darkTheme", darkTheme.checked);
}

var hideElements = function() {

	var myClassHidden = document.querySelectorAll(".hiddenClass");
   
    len = myClassHidden.length;

for (var i = 0; i < len; i++) {

	console.log(i);
	console.log(myClassHidden[i]);
    myClassHidden[i].style.visibility = 'hidden';
}
	
}

var showElements = function() {
	var arrayClass = ['.hiddenClass'];
	
    i = 0;
    l = arrayClass.length;

for (i; i < l; i++) {
	var myClassHidden = document.querySelectorAll(arrayClass[i]);
	console.log(arrayClass[i]);
    myClassHidden[i].style.visibility = 'visible';
}
	
}

var update = {};
update.name = function(name,channelId) {
  shareURL = baseURL + channelId;
  changeText(document.querySelector("#name"), name);
  document.getElementById('idPicture').href = "https://www.youtube.com/channel/" + channelId + "?sub_confirmation=1";
}
update.queryName = function() {
    var reqType = (rawInput.length >= 24 && rawInput.substr(0, 2).toUpperCase() == "UC") ? "channelId" : "q";
    console.log("encodeURIComponent(rawInput) >= 24" + rawInput.length >= 24);
    console.log("encodeURIComponent(rawInput).substr(0, 2).toUpperCase() == UC" + rawInput.substr(0, 2).toUpperCase() == "UC");
    console.log("https://www.googleapis.com/youtube/v3/search?part=snippet&" + reqType + "=" + encodeURIComponent(rawInput) + "&type=channel&maxResults=1&key=" + update.getKey());
    console.log("update.queryname rawinput" + rawInput);
  getText("https://www.googleapis.com/youtube/v3/search?part=snippet&" + reqType + "=" + encodeURIComponent(rawInput) + "&type=channel&maxResults=1&key=" + update.getKey(), function(e) {
    if (e == "nex") {
        setTimeout(function () {
        },1000);
      return;
    }
    e = JSON.parse(e);
    if (e.pageInfo.totalResults < 1) {
      newUsername("#Music", "NÃ£o consegui encontrar este canal. ");
      return;
    }else{
		soundNotPlayed = false;
	}
	var u = e.items[0].snippet.channelId;
    var n = e.items[0].snippet.title;
    if (isEmbed) {
      document.getElementById("picture").src = e.items[0].snippet.thumbnails.medium.url;
	  document.getElementById("picture").setAttribute("class", "profilePicture");
    }
    update.name(n,u);
	//history.pushState(null, null, "/" + n.replace(/\s/g, ''));
  })
}



update.getChannelId = function(a) {
	
	
  getText("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + encodeURIComponent(a) + "&type=channel&maxResults=1&key=" + update.getKey(), function(e) {
    if (e == "nex") {
      update.parseInput(a);
      return;
    }
    e = JSON.parse(e);
    if (e.pageInfo.totalResults < 1) {
      newUsername("#Music", "Could not find any channel with that name. ");
      return;
    }
	
	console.log("channel id : " + e.items[0].snippet.channelId);
    username = e.items[0].snippet.channelId;
	rawInput = username;
	update.live();
	
    
  })
	
}

update.isLive = 0;
update.live = function() {
	console.log("username live popstate : " + username);
  var reqType = (username.length >= 24 && username.substr(0, 2).toUpperCase() == "UC") ? "id" : "forUsername";
  console.log(reqType);
  var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&" + reqType + "=" + username + "&key=" + update.getKey();
	console.log("url live : " + url);
  getText(url, function(e) {
    if (e == "nex") {
      return; // pass it on
    }
    e = JSON.parse(e);
	
	if(typeof e.items[0] === 'undefined'){ 	
		
				 	console.log("username : " + username);
					update.getChannelId(username);
					console.log("channel id username : " + update.getChannelId(username));

	}else{ 
			
			//console.log("url :" + url);
		var subscriberCount = e.items[0].statistics.subscriberCount;
		//alert(subscriberCount * 2)
    var videoCount = e.items[0].statistics.videoCount;
    var viewCount = e.items[0].statistics.viewCount;
	var commentCount = e.items[0].statistics.commentCount;
	
    if (!update.isLive) {
      new Odometer({
        el: document.querySelector(".count_live"),
        format: '(,ddd)',
        theme: 'minimal'
      });
	  
	  
      changeText(document.querySelector(".count_live"), subscriberCount);

      update.isLive = 1;
    } else {
      changeText(document.querySelector(".count_live"), subscriberCount);
	  
    }
			
	}
		  

    
  });
}
update.parseInput = function(a) {
  rawInput = a;
    var reqType = (a.length >= 24 && a.substr(0, 2).toUpperCase() == "UC") ? "channelId" : "q";
  getText("https://www.googleapis.com/youtube/v3/search?part=snippet&" + reqType + "=" + encodeURIComponent(a) + "&type=channel&maxResults=1&key=" + update.getKey(), function(e) {
    if (e == "nex") {
      update.parseInput(a);
      return;
    }
    e = JSON.parse(e);
    if (e.pageInfo.totalResults < 1) {
      newUsername("#Music", "Could not find any channel with that name. ");
      return;
    }
    var u = e.items[0].snippet.channelId;
	channelId = e.items[0].snippet.channelId;
    var n = e.items[0].snippet.title;
	
	update.name(n,u);
    update.reset(u,n);
    
  })
}


update.interval = function(s){

}

update.share = function(a) {
  var sharableLink = encodeURIComponent(shareURL);
  var facebook = "https://www.facebook.com/dialog/feed?app_id=449507112089137&display=page&caption=Contador%20de%20Inscritos%20para%20YouTube%20em%20tempo%20real&link=" + sharableLink;
  var twitter = "https://twitter.com/intent/tweet?original_referer=" + sharableLink + "&ref_src=twsrc%5Etfw&text=" + encodeURIComponent(document.title + " : ") + "&tw_p=tweetbutton&via=Geeky_yt&url=" + sharableLink;
  var youtube = "https://www.youtube.com/" + ((username.length >= 24 && username.substr(0, 2).toUpperCase() == "UC") ? "channel" : "user") + "/" + username + "/?sub_confirmation=1";
  switch (a) {
    case 'twtr':
      window.open(twitter);
      break;
    case 'fb':
      window.open(facebook);
      break;
    case 'yt':
      window.open(youtube);
      break;
    default:
      console.log("That's not how it works.");
  }
}
update.getKey = function() {
  keyIndex = (keyIndex + 1) % (APIkeys.length);
  return APIkeys[keyIndex];
}
update.all = function() {
  //document.getElementById('embedCode').value = '<iframe height="80px" width="300px" frameborder="0" src="' + baseURL + "embed/#!/" + username + '" style="border: 0; width:300px; height:80px; background-color: #FFF;"></iframe>';
  update.queryName();
  update.live();
}
update.reset = function(a,b) {
  if (!a) return;
  if (a.trim() == username)
    return;
console.log("update reset username " + a + " " + username);
  username = a.trim();
  console.log("update reset " + username);
 if(channelParam){
	  history.replaceState("","","/" + b.replace(/\s/g, '-'))
  }else{
	  history.pushState(null, null, "/" + b.replace(/\s/g, '-'));
  }
  changeText(document.getElementById('name'), "Loading ...");
  update.all();
  ga('send', 'pageview', {
    'page': location.pathname + location.search + location.hash,
    'title': document.title
  });
}



function newUsername(a, b) {
	
  var te = prompt(((typeof(b) == "string") ? b : "") + "Entrar nome do canal:", (typeof(a) == "string") ? a : username);
  if (te == null) return;
  if (te.trim() == username || te.trim() == "")
    return;
  if (te)
    update.parseInput(te.trim());
document.getElementById("picture").setAttribute("class", "profilePictureTransparent");

  //changeText(document.getElementById('username'), "Loading...");
  console.log("newUsername " +username);
  history.pushState(null, null, "/" + username.replace(/\s/g, '-'));
}
window.onpopstate = function() {
	console.log("location.search : " + (/.net\/(.*)/.exec(window.location))[1]);
  var te = (/.net\/(.*)/.exec(window.location))[1];
  console.log("te : " + te);
  if (te) {
    username = te.trim();
    rawInput = username;
    changeText(document.querySelector('#name'), "Loading...");
    update.queryName();
  }
}
function getURL(){
	var t=decodeURIComponent((RegExp("[?|&]channel=([^&;]+?)(&|#|;|$)").exec(location.search)||[,""])[1].replace(/\+/g,"%20"))||null
null==t?t=(/.net\/(.*)/.exec(window.location)||[,""])[1]:window.history.replaceState("","","/"+t)}

window.onload = function() {
  //var te = location.hash.split("!/")[1];
  var te=decodeURIComponent((RegExp(".org[\/]([^&;]+?)(&|#|;|$)").exec(location.search)||[,""])[1].replace(/\+/g,"%20"))||null
null==te?te=(/.org\/(.*)/.exec(window.location)||[,""])[1]:window.history.replaceState("","","/"+te)
  console.log("te : " + te);

	  console.log("prout");
if(te=="index.php"){
	te=null;
}
  if (te && te!="subscriber-count" && te!="live-subscriber-count" && te!="live-counts"
&& te!="sub-count" && te!="real-time-youtube" ) {
	  if(te=="#!"){
		  location.replace("http://contadordeinscritos.org");
	  }
	  channelParam = true;
	  console.log("te true");
	update.parseInput(te);
    //username = te.trim();
	console.log("username : " + username);
	//history.pushState(null, null, "/" + username);
    //rawInput = username;
  } else {
        history.pushState(null, null,  username);
		update.all();
	  console.log("te false");
	  console.log("window.onload " + username);
    
  }
  
  
  //update.all();
  
  
  setInterval(update.live, 30 * 1000);

  if (isEmbed) document.querySelector("#name").onclick = newUsername;
	
  darkTheme = document.getElementById('darkTheme');
	readStorage();

//GoogleAnalyticsObject
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44723827-4', 'auto');
  ga('send', 'pageview');


}


