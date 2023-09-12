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
	constructor(title, project, priority, status='pending', description='', createdDay='', dueDay=''){
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
	constructor(title, project, code){
		this.title = title;
		this.project = project;
		this.code;
	}
}

// low level function
function getTypeOfItem(item){
	return item.constructor.name.toLowerCase();
}

// low level function: checks wheter certain item is unique inside its level of closure
function isUniqueThisItemInItsLevel(storage, item){
	let tree = storage.projectsTree;
	let isUnique = true;

	//storage is empty
	if(Object.keys(tree).length == 1){
		return isUnique;
	}
	//storage is not empty
	else {
		//get type of item
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

			// work below th, this line ----
			//is sub project
			else {
				for(let obj in tree[item.project]){
					if(obj == item.title){
						isUnique = false;
					}
				}
			}
		} else { //item is no a project
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

	let typeOfItem = getTypeOfItem(item);
	//check if our item is a project
	if(typeOfItem == 'project'){
		//true: it is a project
		//check if project is already created
		if(isUniqueThisItemInItsLevel(storage, item) && item.project == ""){
			storage.projectAssigned[item.title] = {};
			storage.projectsTree[item.title] = {};
			return;
		} else {
			return;
		}
	}else{
	//false: it is not a project
		//it is not unique
		if(!isUniqueThisItemInItsLevel(storage,item)){
			console.log('such item already exist');
			return;
		} else {
		//it is unique
			//no project assigned
			if(item.project == ''){
				storage.noProjectAssigned[item.code] = item;
				return;
			} else {
			//project assigned
				//project already exist
				if(storage.projectAssigned.hasOwnProperty(item.project)){
					storage.projectAssigned[item.project][item.code] = item;
				} else {
				//project doesnt exist
					let newProject = new Project(item.project, '');
					identifyItemAndSave(newProject, storage);
					saveItemToStorage(item, storage);
					return;
				}
			}
		}
	}

	return;
}

// high level func
function identifyItemAndSave(item={}, storage={}){
	assignCodetoItem(item, storage);
	saveItemToStorage(item, storage);

	return
}

function removeItemFromStorage(item={}, storage={}){
	let typeOfItem = getTypeOfItem(item);
	//item is a project
	if(typeOfItem == 'project'){
		//check if it's main project or subproject
		if(item.project == ""){
			//is a main project
			delete storage['projectAssigned'][item.title];
			delete storage['projectsTree'][item.title];
		} else {
			//is a subproject
			delete storage['projectAssigned'][item.project][item.title];
			delete storage['projectsTree'][item.project][item.title];
		}
	} else {
	//item is not a project
		//check if it is assigned to a project;
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