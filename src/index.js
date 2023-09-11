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
	constructor(title, description, createdDay, dueDay, priority, project, status){
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
						console.log('is not unique')
						isUnique = false;
					}
				}
			}

			// work below this line ----
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
					if(storage.noProjectAssigned[obj].title == item.title){
						isUnique = false;
					}
				}
			}
			// item is assigned to a project
			else {
				for(let obj in storage.projectAssigned[item.project]){
					if(storage.projectAssigned[item.project][obj].title == item.title){
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
		//check if project is already created
		if(isUniqueThisItemInItsLevel(storage, item) && item.project == ""){
			console.log(isUniqueThisItemInItsLevel(storage, item))
			storage.projectAssigned[item.title] = {};
			storage.projectsTree[item.title] = {};
		} else {
			console.log('such project already exist')
		}
	}
		//true: it is a project
		//false: it is not a project


	return;
}

// high level func
function identifyItemAndSave(item={}, storage={}){
	assignCodetoItem(item, storage);
	saveItemToStorage(item, storage);

	return
}

function removeItemFromStorage(item={}, storage={}){
	//check if item is assigned to a project
		//check what kind of item is

}


let test3 = new Project('secondP', '');
let test4 = new Project('secondP', '');

console.log('itemsStorage1', itemsStorage)
identifyItemAndSave(test3, itemsStorage);
identifyItemAndSave(test4, itemsStorage);
console.log('itemsStorage2', itemsStorage)