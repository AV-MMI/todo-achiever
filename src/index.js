import './styles/styles.css';

const itemsStorage = {
	counter: 0,

	projectAssigned: {},
	noProjectAssigned: {},
}

class Task {
	constructor(title, description, createdDay, dueDay, priority, project, status, code){
		this.title = title;
		this.createdDay = createdDay;
		this.dueDay = dueDay;
		this.priority = priority;
		this.project = project;
		this.description = description;
		this.status = status;
	}
}

class Checklist {
	constructor(title, project, items={}){
		this.title = title;
		this.project = project;
		this.items = items;
	}
}

class Note {
	constructor(title, text, project){
		this.title = title;
		this.text = text;
		this.project = project;
	}
}

class Project {
	constructor(title, text, project, code){
		this.title;
		this.text;
		this.code;
	}

	_tasks;
	_notes;
	_checklists;

	get tasks(){
		return _tasks;
	}

	set tasks(tasks){
		_tasks = tasks;
	}



	get notes(){
		return _notes;
	}

	set notes(notes){
		_notes = notes
	}



	get checklists(){
		return _checklist;
	}

	set checklists(checklists){
		_checklist = checklists;
	}
}

// low level func for identifyItemAndSave
function assignCodetoItem(item, storage){
	//Obtain first letter identifier;
	let letter = item.constructor.name[0];
	let code = `${letter}${itemsStorage.counter}`;
	itemsStorage.counter++;

	item.code = code;
	return;
}

// low level func for identifyItemAndSave
	//save item to storage and in case of having the project prop !== '' assign to that project;
function saveItemToStorage(item={}, storage={}){
	//save item to storage
	let typeOfItem = item.constructor.name.toLowerCase();

	// if item is assigned to a project.
	if(item.project !== ''){
		// in case the project doesnt exist;
		if(storage.projectAssigned[item.project] == undefined){
			storage.projectAssigned[item.project] = {};
			storage.projectAssigned[item.project][typeOfItem] = {};
			storage.projectAssigned[item.project][typeOfItem][item.code] = {};
			storage.projectAssigned[item.project][typeOfItem][item.code] = item;
		}
		else {
			storage.projectAssigned[item.project][typeOfItem][item.code] = {};
			storage.projectAssigned[item.project][typeOfItem][item.code] = item;
		}
	} else {
	// if item is not assigned to any project;
	storage.noProjectAssigned[typeOfItem] = {};
	storage.noProjectAssigned[typeOfItem][item.code] = {};
	}

	return;
}

function identifyItemAndSave(item, storage){
	assignCodetoItem(item, storage);
	saveItemToStorage(item, storage);

	return
}