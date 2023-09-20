import './styles/styles.css';

const itemsStorage = {
	counter: 0,

	projectAssigned: {},
	noProjectAssigned: {},
	projectsTree: {
		unassigned: {},
	}
}

class Task {
	constructor(title, project='', priority='low', status='pending', description='', createdDay='', dueDay=''){
		this.title = title.toLowerCase();
		this.createdDay = createdDay;
		this.dueDay = dueDay;
		this.priority = priority;
		this.project = project;
		this.description = description;
		this.status = status;
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
	constructor(title, project='', code, status='pending'){
		this.title = title.toLowerCase();
		this.project = project;
		this.code;
		this.status = status;
	}
}

// low level function
function getTypeOfItem(item){
	if(item){
		return item.constructor.name.toLowerCase();
	} else {
		return item
	}
}

// low level function: checks wheter certain item is unique inside its level of closure
function isUniqueThisItemInItsLevel(item, storage){
	let tree = storage.projectsTree;
	let isUnique = true;

	// storage is empty
	if(Object.keys(tree).length == 1){
		return isUnique;
	}
	// storage is not empty
	else {
		// get type of item
		const typeOfItem = getTypeOfItem(item);
		if(typeOfItem == 'project'){
			//is main project
			if(item.project == ''){
				for(let project in tree){
					if(project == item.title){
						isUnique = false;
					}
				}
			}

			// is sub project
			else {
				for(let obj in tree[item.project]){
					if(obj == item.title){
						isUnique = false;
					}
				}
			}
		} else {
		// item is no a project
			// item is not assigned to a project
			if(item.project == ''){
				for(let obj in storage.noProjectAssigned){
					console.log({obj, item})
					if(obj.title == item.title){
						isUnique = false;
					}
				}
			}
			// item is assigned to a project
			else {
				for(let obj in storage.projectAssigned[item.project]){
					if(obj.title == item.title){
						isUnique = false;
					}
				}
			}
		}

		return isUnique;
	}
}

// low level function: gets the main project from the item passed.
function getMainProjectOf(item, storage){
	let subproject = item.project;
	let mainProject;

	for(let project in storage['projectsTree']){
		if(storage['projectsTree'][project][subproject]){
				mainProject = storage['projectsTree'][project];
				break;
		}
	}

	return mainProject;
}

// low level func for identifyItemAndSave
// CRUD - Create -helper
function assignCodetoItem(item, storage){
	// Obtain first letter identifier;
	let letter = item.constructor.name[0];
	let code = `${letter}${itemsStorage.counter}`;
	itemsStorage.counter++;

	if(item.hasOwnProperty('code')){
		return;
	} else {
		Object.defineProperty(item, 'code', {
	 	 value: code,
	 	 writable: false,
	 	 enumerable: true,
		});
	}

	return;
}
// low level func for identifyItemAndSave
// CRUD - Create -helper
	// save item to storage and in case of having the project prop !== '' assign to that project;
function saveItemToStorage(item={}, storage={}){

	let typeOfItem = getTypeOfItem(item);
	// item is a project
	if(typeOfItem == 'project'){
		// item is main project
		if(item.project == ''){
			if(isUniqueThisItemInItsLevel(item, storage)){
				storage['projectAssigned'][item.title] = item;
				storage['projectsTree'][item.title] = item;
			} else {
				console.log('already exist a main project with this name');
			}
		}

		// item is subproject
		if(item.project !== ''){
			// main project does exist
			if(storage['projectAssigned'][item.project]){
				if(isUniqueThisItemInItsLevel(item, storage)){
					storage['projectAssigned'][item.project][item.title] = item;
					storage['projectsTree'][item.project][item.title] = item;
				} else {
					console.log('already exist a sub project with this name');
				}
			}

			// main project does NOT exist then create it
			else if(!storage['projectAssigned'][item.project]){
				let newProject = new Project(item.project);

				identifyItemAndSave(newProject, storage);
				saveItemToStorage(item, storage);
			}
		}
	}

	// item is NOT a project
	else if(typeOfItem !== 'project'){
		// item is not assigned to a project
		if(item.project == ''){
			storage['noProjectAssigned'][item.code] = item;
		}

		// item is assigned to a project
		else if(item.project !== ''){
			// project is a main project
			if(storage['projectsTree'][item.project]){
				storage['projectAssigned'][item.project][item.code] = item;

			}

			// project is a sub project

			else if(!storage['projectsTree'][item.project] && getMainProjectOf(item, storage)){
				let mainProject = getMainProjectOf(item, storage);

				storage['projectAssigned'][mainProject.title][item.project][item.code] = item;
			}

			// project doesnt exist: so create it as a main project
			else {
				let newProject = new Project(item.project);

				//work on saving the item in the recently created project
				identifyItemAndSave(newProject, storage);
				saveItemToStorage(item, storage);

			}
		}
	}

	return;
}

// high level func
// CRUD - Create
function identifyItemAndSave(item={}, storage={}){
	assignCodetoItem(item, storage);
	saveItemToStorage(item, storage);

	return
}

// CRUD - Remove
function removeItemFromStorage(item={}, storage={}){
	let typeOfItem = getTypeOfItem(item);
	// item is a project
	if(typeOfItem == 'project'){
		// check if it's main project or subproject
		if(item.project == ""){
			// is a main project
			delete storage['projectAssigned'][item.title];
			delete storage['projectsTree'][item.title];
		} else {
			// is a subproject
			delete storage['projectAssigned'][item.project][item.title];
			delete storage['projectsTree'][item.project][item.title];
		}
	} else {
	// item is not a project
		// check if it is assigned to a project;
		if(item.project == ''){
			// is not assigned to a project
			delete storage['noProjectAssigned'][item.code];

		} else {
			// it is assigned to a project
			delete storage['projectAssigned'][item.project][item.code];
		}
	}

	return;
}

// CRUD - Edit -helper
function turnProjectIntoSubproject(formerMainproject={}, parentProject={}, storage={}){
	// copying obj from formarMainProject
	let subproject = JSON.parse(JSON.stringify( storage['projectAssigned'][formerMainproject.title] ));
	// assing own propertys that corresponds to our new subproject
	Object.assign(subproject, formerMainproject);
	subproject.project = parentProject.title;

	storage['projectAssigned'][parentProject.title][subproject.title] = subproject;
	storage['projectsTree'][parentProject.title][subproject.title] = subproject;

	delete storage['projectsTree'][formerMainproject.title];
	delete storage['projectAssigned'][formerMainproject.title];

	return
}

// CRUD - Edit -helper
function turnSubprojectIntoMainproject(item, storage){

}

// CRUD - Edit
	// transfer item from project to project
function transferItemFromProjectToProject(item, projectFrom, projectTo){

}

// low level function: to help modifyItem() in the case that the property modified
// is the title of a project, and such new title must be assigned to every child of
// such project.
function updateProjectPropInChildren(projectItem, storage){
	let childrenObj;
	// check if it is a main project
	if(projectItem['project'] == ''){
		for(let prop in storage['projectAssigned'][projectItem.title]){
			if(storage['projectAssigned'][projectItem.title].hasOwnProperty(prop)){
				console.log(storage['projectAssigned'], 'item');
			}
		}
	} else {
	// it is a subproject
	}
}

// CRUD - Edit
	// modify item: can only modify the properties the obj already has.
	// special cases: data[0]==title, data[0]==pŕoject
function modifyItem(item, data=[], storage){
	let typeOfItem = getTypeOfItem(item);
	// check if it is a project
	if(typeOfItem == 'project'){
		if(item.hasOwnProperty(data[0])){
			// check for special case
			if(data[0] == 'project'){
				// from sub to main
				if(item.project !== '' && data[1] == ''){
					let storageItem = JSON.parse(JSON.stringify( storage['projectAssigned'][item.project][item.title] ));
					storageItem.project = '';

					storage['projectAssigned'][storageItem.title] = storageItem;
					storage['projectsTree'][storageItem.title] = { title:item.title, project:'', code:item.code, status:item.status };

					delete storage['projectAssigned'][item.project][item.title];
					delete storage['projectsTree'][item.project][item.title];
				}

				// from main to sub
				else if(item.project == '' && data[1] !== ''){
					let storageItem = JSON.parse(JSON.stringify( storage['projectAssigned'][item.title] ));
					storageItem.project = data[1];
					console.log(storageItem, 'storage')

					storage['projectAssigned'][storageItem.project] = storageItem;
					storage['projectsTree'][storageItem.project][storage.item] = { title:item.title, project:'', code:item.code, status:item.status }

					delete storage['projectAssigned'][storageItem.title];
					delete storage['projectsTree'][storageItem.title];

				}
			}
		}
	}

	// item is not a project
	else {
	}
}

let project1 = new Project('project1', '');
let project2 = new Project('formerMP', 'project1');
let project3 = new Project('windforce', 'physics');
/*identifyItemAndSave(project1, itemsStorage);
identifyItemAndSave(task1, itemsStorage);*/
identifyItemAndSave(project1, itemsStorage);
identifyItemAndSave(project2, itemsStorage);

identifyItemAndSave(project3, itemsStorage);

// testing no-projects items
// no project assign
let taskUn = new Task('testing unassigned', '');
identifyItemAndSave(taskUn, itemsStorage);

	// main project
let task4 = new Task('pressure difference', 'physics');
identifyItemAndSave(task4, itemsStorage);

	// sub project
let task5 = new Task('Inconditionality', 'windforce');
identifyItemAndSave(task5, itemsStorage);

	//project does NOT exist
let task6 = new Task('Ana-Gabriel', 'music');
identifyItemAndSave(task6, itemsStorage);


// deep copy of newWind to test the main to sub, then the sub to sub
let newWind = itemsStorage['projectAssigned']['windforce'];
console.log('newWind', newWind, getTypeOfItem(newWind));
modifyItem(project3, ['project', ''], itemsStorage);
modifyItem(newWind, ['project', 'music'], itemsStorage);

console.log(itemsStorage, '0 iteration');