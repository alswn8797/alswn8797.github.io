//array to store tasks
var topay = [];
var filename = location.pathname.split("/").slice(-1);

window.addEventListener("load",function(){
  addCordovaEvents();
  loadList(topay);

if(filename == "index.html"){

  showButton("remove",topay);
  //listener for touch on the list of tasks
  var wagelist = document.getElementById('wage-list');
  document.getElementById("wage-list").addEventListener("click",function(event){
    //before changing status, short delay
    var id=event.target.getAttribute("id");
    var elm=document.getElementById(id);
    if(elm.classList.contains("done")){
      changeStatus(id,0);
    }
    else{
      changeStatus(id,1);
    }
    showButton("remove",topay);
  });

  document.getElementById("remove").addEventListener("click",function(){
    //when removing items remove from the end of list
    var len = topay.length-1;
    for(i=len;i>=0;i--){
      var item = topay[i];
      if(item.status==1){
        topay.splice(i,1);
        saveList(topay);
        //before
        renderList("wage-list",topay);
      }
    }
    showButton("remove",topay);
  });

}

});

if(filename == "index.html"){

//for changing page
var inputform = document.getElementById("input-form");
inputform.addEventListener("submit",function(event){
  console.log(event.target);
  event.preventDefault();
  //get task input value
  window.location = "./wage-calculate.html";
});

} else {

//for changing page
var inputform = document.getElementById("wage-form");
inputform.addEventListener("submit",function(event){
  console.log(event.target);
  event.preventDefault();
  //get task input value
  
});

}

function addCordovaEvents(){
  document.addEventListener("deviceready",onDeviceReady,false);
}
function onDeviceReady(){
  document.addEventListener("pause",function(){
    //when app is paused (eg home button pressed) save list
    saveList(topay);
  },false);
  document.addEventListener("resume",function(){
    //when app is resumed (brought back from sleep) load list
    loadList(topay);
  },false);
  document.addEventListener("backbutton",function(){
    //when backbutton is pressed, exit app
    saveList(topay);
    navigator.app.exitApp();
  },false);
}

document.addEventListener('backbutton', function (evt) {
    if (cordova.platformId !== 'windows') {
        return;
    }

    if (filename !== "index.html") {
        window.history.back();
    } else {
        throw new Error('Exit'); // This will suspend the app
    }
}, false);

function saveList(list_array){
  if(window.localStorage){
    localStorage.setItem("wages",JSON.stringify(list_array));
  }
}

function loadList(list_array){
  if(window.localStorage){
    try{
      if(JSON.parse(localStorage.getItem("wages"))){
        topay = JSON.parse(localStorage.getItem("wages"));
      }
    }
    catch(error){
      console.log("error"+error);
    }
  }

	if(filename == "index.html"){
	  renderList("wage-list",topay);
	}
}

function renderList(elm,list_array){
  var container = document.getElementById(elm);
  saveList(list_array);
  container.innerHTML="";
  itemstotal = list_array.length;
  for(i=0;i<itemstotal;i++){
    item = list_array[i];
    listitem = document.createElement('LI');
    listtext = document.createTextNode(item.name+" $"+item.wage);
    listitem.appendChild(listtext);
    listitem.setAttribute("id",item.id);
    listitem.setAttribute("data-status",item.status);
    if(item.status==1){
      listitem.setAttribute("class","done");
    }
    container.appendChild(listitem);
  }
}

//function used to show or hide the button to remove "done" tasks
//this function checks whether to show the "clear" button
function showButton(element,arr){
  var show=false;
  var len=arr.length;
  for(i=0;i<len;i++){
    var item = arr[i];
    if(item.status == 1){
      show = true;
    }
  }
  if(show==true){
    document.getElementById(element).setAttribute("class","show");
  }
  else{
    document.getElementById(element).removeAttribute("class");
  }
}

function changeStatus(id,status){
  switch(status){
    case 1:
      document.getElementById(id).setAttribute("class","done");
      for(i=0;i<topay.length;i++){
        wageitem = topay[i];
        if(wageitem.id == id){
          wageitem.status = 1;
          saveList(topay);
        }
      }
      break;
    case 0:
      document.getElementById(id).removeAttribute("class");
      for(i=0;i<topay.length;i++){
        wageitem = topay[i];
        if(wageitem.id == id){
          wageitem.status = 0;
          saveList(topay);
        }
      }
      break;
    default:
      break;
  }
}

function checkWage(){
	var wage = 0;
	var satRate = 1.5;
	var sunRate = 2;
	var hours = document.getElementsByName('hours');
	var hourlyRate = document.getElementById('hourly-rate').value;
	
	if(hourlyRate == ''){
		alert("Please, input hourly rate first!!");
		document.getElementById('hourly-rate').focus();
	} else {
		for(i=0; i<hours.length; i++){
			if(hours[i].value != ''){
				if(i==5){
					wage = wage + (hourlyRate * satRate) * hours[i].value;
				} else if(i==6){
					wage = wage + ((hourlyRate * sunRate) * hours[i].value);
				} else {
					wage += hourlyRate * hours[i].value;
				}
			}
		}
		wage = Math.round(wage * 100) / 100;

		document.getElementById('wage').focus();
		document.getElementById('wage').value = wage;
	}
}

function addWage(){
	id = new Date().getTime();
	name = document.getElementById('name-input').value;
	wage = document.getElementById('wage').value;
	
	if(name == ''){
		alert("Please, input worker's name");
		document.getElementById('name-input').focus();
	}
	else if(wage == ''){
		alert("Please, CHECK wage first to ADD!!");
	} else {
		wageitem ={id:id,name:name,wage:wage,status:0};
		topay.push(wageitem);
		saveList(topay);
		document.getElementById('wage-form').submit();
		//renderList("wage-list",todo);
		window.location = "./index.html";
	}
}
