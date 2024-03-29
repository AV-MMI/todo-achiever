import * as data from './data.js';
export { createItem, removeItem, updateItem }

class Task {
	constructor(title='', project='', done=false, previousProject=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
		this.type = 'task';
		this.todo = true;
		this.previousProject = previousProject;

	}
}

class Project {
	constructor(title='', project='', done=false, previousProject=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
		this.type = 'project';
		this.todo = true;
		this.previousProject = previousProject;

	}
}

class Checklist {
	constructor(title, project, done=false, items=[], previousProject=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = 'checklist';
		this.done = done;
		this.items = items;
		this.todo = true;
		this.previousProject = previousProject;

	}

	addTask(task={}){
		this.items.push(task);
	}

	getTask(title){
		let task = data.storage.getObj(['title', title], this.items) || false;
		return task;
	}
}

class Note {
	constructor(title, project, done=false, text, previousProject=false){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = 'note';
		this.done = done;
		this.text = text;
		this.todo = true;
		this.previousProject = previousProject;
	}
}

function createItem(obj){
	if(obj.type == 'project'){
		let newProject = new Project(obj.title, obj.project, obj.done, obj.previousProject);
		data.storage.addObj(newProject);
	}
	else if(obj.type == 'task'){
		let newTask = new Task(obj.title, obj.project, obj.done, obj.previousProject);
		data.storage.addObj(newTask);
	}
	else if(obj.type == 'checklist'){
		let newChecklist = new Checklist(obj.title, obj.project, obj.done, obj.items, obj.previousProject);
		data.storage.addObj(newChecklist);
	}
	else if(obj.type == 'note'){
		let newNote = new Note(obj.title, obj.project, obj.done, obj.text, obj.previousProject);
		data.storage.addObj(newNote);
	}

	if(data.userSetting.storage.local){
		data.populateStorage();
	}
}

function removeItem(objId){
	data.storage.removeObj( storage.getObj(['id', objId]) );

	if(data.userSetting.storage.local){
		data.populateStorage();
	}
}

function updateItem(objId, data=[]){
	data.storage.updateObj( storage.getObj(['id', objId]), data );

	if(data.userSetting.storage.local){
		data.populateStorage();
	}
}

function getStorage(){
	return data.storage.objs;
}

function getItem(objId){
	return data.storage.getObj(['id', id]);
}