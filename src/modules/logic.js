import * as data from './data.js';
export { createItem, removeItem, updateItem }

class Task {
	constructor(title='', project='', done=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
		this.type = 'task';
		this.todo = true;
	}
}

class Project {
	constructor(title='', project='', done=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
		this.type = 'project';
		this.todo = true;
	}
}

class Checklist {
	constructor(title, project, done=false, items=[]){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = 'checklist';
		this.done = done;
		this.items = items;
		this.todo = true;
	}

	addTask(task={}){
		this.items.push(task);
	}

	getTask(title){
		let task = data.storage.getItem(['title', title], this.items);
	}
}

class Note {
	constructor(title, project, done=false, text){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = 'note';
		this.done = done;
		this.text = text;
		this.todo = true;
	}
}

function createItem(obj){
	if(obj.type == 'project'){
		let newProject = new Project(obj.title, obj.project, obj.done);
		data.storage.addObj(newProject);
	}
	else if(obj.type == 'task'){
		let newTask = new Task(obj.title, obj.project, obj.done);
		data.storage.addObj(newTask);
	}
	else if(obj.type == 'checklist'){
		let newChecklist = new Checklist(obj.title, obj.project, obj.done, obj.items);
		data.storage.addObj(newChecklist);
	}
	else if(obj.type == 'note'){
		let newNote = new Note(obj.title, obj.project, obj.done, obj.text);
		data.storage.addObj(newNote);
	}
}

function removeItem(objId){
	data.storage.removeObj( storage.getObj(['id', objId]) );
}

function updateItem(objId, data=[]){
	data.storage.updateObj( storage.getObj(['id', objId]), data );
}

function getStorage(){
	return data.storage.objs;
}

function getItem(objId){
	return data.storage.getObj(['id', id]);
}