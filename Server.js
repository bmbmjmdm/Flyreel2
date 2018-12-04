var TODO = require('./TODO.js');
var Database = require('./Database.js');

var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  

  //create a new TODO
  if(q.pathname == "/create"){
	
	//currently not validating input for time sake, using big try/catch instead 
	try{
	
		//create the TODO for the given username and add it to the database
		var username = q.query.username;
		var due = q.query.due;
		var title = q.query.title;
		var desc = q.query.desc;
		
		var newTODO = new TODO(due, title, desc);
		
		Database.addTODO(username, newTODO);
	
		//return the successfull TODO
		res.writeHead(200);
		res.write(JSON.stringify(newTODO));
		res.end();
	}
	
	catch(error){
		//something went wrong, error 
		res.writeHead(404);
		res.write(JSON.stringify(error));
		res.end();
	
	}
  }
  
  //delete an existing TODO
  else if (q.pathname == "/delete"){
	
	//currently not validating input for time sake, using big try/catch instead 
	try{
	
		//delete the TODO for the given username and id
		var username = q.query.username;
		var id = q.query.id;
		
		var deleted = Database.deleteTODO(username, id);
	
		//return the successful delete
		res.writeHead(200);
		res.write(JSON.stringify("Deleted = "+deleted));
		res.end();
	}
	
	catch(error){
		//something went wrong, error 
		res.writeHead(404);
		res.write(JSON.stringify(error));
		res.end();
	
	}
  }
  
  //update an existing TODO
  else if (q.pathname == "/update"){
	
	//currently not validating input for time sake, using big try/catch instead 
	try{
	
		//update the TODO for the given username and info from query
		var username = q.query.username;
		var due = q.query.due;
		var title = q.query.title;
		var desc = q.query.desc;
		var complete = q.query.complete;
		var id = q.query.id;
		
		var updated = Database.updateTODO(username, id, due, title, desc, complete);
	
		//return the successful update
		res.writeHead(200);
		res.write(JSON.stringify("Updated = "+updated));
		res.end();
	}
	
	catch(error){
		//something went wrong, error 
		res.writeHead(404);
		res.write(JSON.stringify(error));
		res.end();
	
	}
  }
  
  //read a user's TODOs 
  else if (q.pathname == "/read"){
	
	//currently not validating input for time sake, using big try/catch instead 
	try{
	
		//read the TODOs of a given username from the database, filtering them appropriately 
		var username = q.query.username;
		
		var list = Database.readTODO(username);
	
		//return the successful list 
		res.writeHead(200);
		res.write(JSON.stringify(list));
		res.end();
	}
	
	catch(error){
		//something went wrong, error 
		res.writeHead(404);
		res.write(JSON.stringify(error));
		res.end();
	
	}
  }
  
  
}).listen(3000);