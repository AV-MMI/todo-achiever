import * as repository from './repository.js';
import * as utilities from './utilities.js'
export { Task, Checklist, Note, Project, createItem, removeItem, modifyItem }

class Task {
	constructor(title='', project='', status='pending', description='', createdDay='', dueDay=''){
		this.title = title.toLowerCase();
		this.createdDay = createdDay;
		this.dueDay = dueDay;
		this.project = project.toLowerCase();;
		this.description = description;
		this.status = status.toLowerCase();;
	}
}

class Checklist {
	constructor(title, project, items={}, status='pending'){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.items = items;
		this.status = status;
	}
}

class Note {
	constructor(title, text, project, status='pending'){
		this.title = title.toLowerCase();
		this.text = text;
		this.project = project;
		this.status = status;
		this.code;
	}
}

class Project {
	constructor(title, project='', status='pending'){
		this.title = title.toLowerCase();
		this.project = project;
		this.code;
		this.status = status;
	}
}

// CRUD - Create
function createItem(item){
	repository.identifyItemAndSave(item, repository.getItems())

	return
}

// CRUD - Remove
function removeItem(item={}){
	let route = repository.getProjectPath(item.project, repository.getItems());

	if(utilities.getTypeOfItem(item) == 'project' || item.project !== ''){
		repository.removeItem(item, repository.getItems()['projectAssigned'], route);
	} else {
		repository.removeItem(item, repository.getItems()['noProjectAssigned'], route);
	}
	return
}

// CRUD - Edit
	// modify item: can only modify the properties the obj already has.
	// special cases: project -> title, project
	//			 	  non-project -> project

function modifyItem(item={}, data=[]){
	let route = repository.getProjectPath(item.project, repository.getItems());
	if(utilities.getTypeOfItem(item) == 'project'){
		repository.modifyItem(item, data, repository.getItems()['projectAssigned'], route);
	} else {
		if(item.project !== ''){
			console.log('project assigned');
			repository.modifyItem(item, data, repository.getItems()['projectAssigned'], route);
		} else {
			console.log('no projectAssigned');
			repository.modifyItem(item, data, repository.getItems()['noProjectAssigned'], route);
		}
	}
}