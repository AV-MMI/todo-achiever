import * as repository from './repository.js';
import * as utilities from './utilities.js'
export { Task, Checklist, Note, Project }
console.log('stiiir', repository.getItems);

class Task {
	constructor(title='', project='', priority='low', status='pending', description='', createdDay='', dueDay=''){
		this.title = title.toLowerCase();
		this.createdDay = createdDay;
		this.dueDay = dueDay;
		this.priority = priority;
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
	constructor(title, text, project){
		this.title = title.toLowerCase();
		this.text = text;
		this.project = project;
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
function createItem(item, storage=repository.getItems()){
	repository.identifyItemAndSave(item, storage)

	return
}

// CRUD - Remove
function removeItem(item={}, storage){
	let route = repository.getProjectPath(item.project, storage);

	if(utilities.getTypeOfItem(item) == 'project' || item.project !== ''){
		repository.removeItem(item, storage['projectAssigned'], route);
	} else {
		repository.removeItem(item, storage['noProjectAssigned'], route);
	}
	return
}

// CRUD - Edit
	// modify item: can only modify the properties the obj already has.
	// special cases: project -> title, project
	//			 	  non-project -> project

function modifyItem(item, data, storage){
	console.log('crud side');
	let route = repository.getProjectPath(item.project, storage);
	if(utilities.getTypeOfItem(item) == 'project'){
		repository.modifyItem(item, data, storage['projectsTree'], route);
		repository.modifyItem(item, data, storage['projectAssigned'], route);
	} else {
		repository.modifyItem(item, data, storage['projectAssigned'], route);
	}
}

let project1 = new Project('project1', '');
let project2 = new Project('sbproject1', 'project1');
let project3 = new Project('sbsbproject1', 'sbproject1');
let project4 = new Project('sbsbproject2', 'sbproject1');

let task1 = new Task('taskito', 'sbproject1');
let task2 = new Task('taskazo', '');

//let project3 = new Project('sbproject2', 'sbproject1');
/*
let projectPh = new Project('physics');
let project3 = new Project('windforce', 'physics');
*/
createItem(project1, repository.getItems()	);
createItem(project2, repository.getItems()	);
createItem(project3, repository.getItems()	);
createItem(project4, repository.getItems()	);
createItem(task1, repository.getItems()	);
createItem(task2, repository.getItems()	);
removeItem(task2, repository.getItems() );
//createItem(task2, repository.getItems()	);

//modifyItem(project2, ['project', 'fuera'], repository.getItems() );
//createItem(project3, repository.getItems()	);

/*
createItem(project2, repository.getItems()	);
createItem(projectPh, repository.getItems()	)
createItem(project3, repository.getItems()	);

// testing no-projects items
// no project assign
let taskUn = new Task//('testing unassigned', '');
repository.identifyItemAndSave(taskUn, repository.getItems()	);

	// main project
let task4 = new Task('passing around', '');
repository.identifyItemAndSave(task4, repository.getItems()	);

	// sub project
let task5 = new Task('Inconditionality', 'physics');
repository.identifyItemAndSave(task5, repository.getItems()	);

	//project does NOT exist
let task6 = new Task('Ana-Gabriel', 'windforce');
repository.identifyItemAndSave(task6, repository.getItems()	);

let task21 = new Task('premium', 'formermp');
repository.identifyItemAndSave(task21, repository.getItems()	);


//modifyItem(task6, ['project', 'formermp'], repository.getItems());
*/
console.log(repository.getItems(), '1 iteration');
