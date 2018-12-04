var TODO = require('./TODO.js');

class Database {
	
//******************** Database setup and access *******************

//our hashmap of TODOs, key is username and value is TODO array
//TODOs would be more efficient if they were held in a hashmap corresponding to their ID, not an array! I already wrote up all this code though so won't change it now 
static TODOList = {};

//our hashmap of filter preferences, key is username and value is a function
static filterList = {};

//HARDCODED VALUES FOR USER A B C 
{this.filterList.put('A', this.nextFive);
this.filterList.put('B', this.titleDesc);
this.filterList.put('C', this.incompleteTitles);}



//called on every server call to ensure the username is part of our TODOList and filterList maps, even if their TODOs are empty and filter vanilla
static function addUser(username){
	if(!TODOList[username]){
		TODOList.put(username, []);
	}
	
	//filter function doesnt change list by default 
	if(!filterList[username]){
		filterList.put(username, (list)=>list);
	}
}



static function addTODO(username, todo){
	this.addUser(username);
	TODOList.get(username).push(todo);
}


//remove a TODO item based on its id 
static function deleteTODO(username, id){
	this.addUser(username);
	var list = TODOList.get(username);
	
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
static function updateTODO(username, id, due, title, desc, complete){
	this.addUser(username);
	var list = TODOList.get(username);
	
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
static function readTODO(username){
	this.addUser(username);
	var list = TODOList.get(username);
	
	return filterList.get(username)(list);
}






//****************** Filter functions for special retrieval ********************

//these should be abstracted out into an object of settable paramaters, such as "what variables to return", "how to sort", "how many to return", "what values to filter by", etc. Would do if more time 



//sorts the TODOs by due date and returns the first 5 
//note this alters the original list
static function nextFive(list){
	list.sort((a, b)=>{return new Date(b.date) - new Date(a.date);});
	
	let firstFive = [];
	//make sure we dont go off the end of the array while retrieving the first 5 
	for(let i=0; i<5 && i<list.length; i++){
		firstFive.push(list[i]);
	}
	
	return firstFive;
	
}

//extract each title/desc from the list of TODOs
static function titleDesc(list){
	return list.map((todo)=>{return {title: todo.title, desc: todo.desc, id:todo.id}});
}


//go through all of the TODOs and extract the titles of each incomplete item 
static function incompleteTitles{
	let incomplete = [];
	
	for(let i = 0; i<list.length; i++){
		if(!list[i].complete){
			incomplete.push({title: list[i].title, id:list[i].id});
		}
	}
	
	return incomplete;
}


}

module.exports = Database;