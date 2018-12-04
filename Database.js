var TODO = require('./TODO.js');
	
//******************** Database setup and access *******************

//our hashmap of TODOs, key is username and value is TODO array
//TODOs would be more efficient if they were held in a hashmap corresponding to their ID, not an array! I already wrote up all this code though so won't change it now 
var TODOList = {};

//our hashmap of filter preferences, key is username and value is a function
var filterList = {};

//HARDCODED VALUES FOR USER A B C 
filterList['A']=nextFive;
filterList['B']=titleDesc;
filterList['C']=incompleteTitles;



//called on every server call to ensure the username is part of our TODOList and filterList maps, even if their TODOs are empty and filter vanilla
function addUser(username){
	if(!TODOList[username]){
		TODOList[username]=[];
	}
	
	//filter function doesnt change list by default 
	if(!filterList[username]){
		filterList[username]=(list)=>list;
	}
}



function addTODO(username, todo){
	addUser(username);
	TODOList[username].push(todo);
}


//remove a TODO item based on its id 
function deleteTODO(username, id){
	addUser(username);
	var list = TODOList[username];
	
	var removed = false;
	
	//go through the list of TODOs for the given user and remove the first TODO to match the given id 
	for(let i=0; i < list.length; i++){
		if(list[i].id == id){
			list.splice(i, 1); 
			removed = true;
			break;
		}
	}
	
	return removed;
}


//change the values of a TODO with the given id for the given username 
function updateTODO(username, id, due, title, desc, complete){
	addUser(username);
	var list = TODOList[username];
	
	var updated = false;
	
	for(let i=0; i < list.length; i++){
		if(list[i].id == id){
			list[i].due = due;
			list[i].title = title;
			list[i].desc = desc;
			list[i].complete = (complete == 'true'); //note this doesnt validate the complete input 
			updated = true;
			break;
		}
	}
	
	return updated;
}

//filter the user's TODOs and return them 
function readTODO(username){
	addUser(username);
	var list = TODOList[username];
	
	return filterList[username](list);
}






//****************** Filter functions for special retrieval ********************

//these should be abstracted out into an object of settable paramaters, such as "what variables to return", "how to sort", "how many to return", "what values to filter by", etc. Would do if more time 



//sorts the TODOs by due date and returns the first 5 
//note this alters the original list
//sorting function needs to be updated to not include items PAST due date 
function nextFive(list){
	list.sort((a, b)=>{return new Date(a.date) - new Date(b.date);});
	
	let firstFive = [];
	//make sure we dont go off the end of the array while retrieving the first 5 
	for(let i=0; i<5 && i<list.length; i++){
		firstFive.push(list[i]);
	}
	
	return firstFive;
	
}

//extract each title/desc from the list of TODOs
function titleDesc(list){
	return list.map((todo)=>{return {title: todo.title, desc: todo.desc, id:todo.id}});
}


//go through all of the TODOs and extract the titles of each incomplete item 
function incompleteTitles(list){
	let incomplete = [];
	
	for(let i = 0; i<list.length; i++){
		if(!list[i].complete){
			incomplete.push({title: list[i].title, id:list[i].id});
		}
	}
	
	return incomplete;
}




module.exports = {addTODO, deleteTODO, updateTODO, readTODO};