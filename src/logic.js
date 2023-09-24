import './styles/styles.css';

const itemsStorage = {
	counter: 0,

	projectAssigned: { depot: true },
	noProjectAssigned: { depot: true },
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
	return item.constructor.name.toLowerCase();
}

// low level function
function getItemFrom(data=[], storage={}){
	let match = null;

	for(let item in storage){
		if(storage[item]['depot'] || getTypeOfItem(storage[item]) == 'project'){
			match = getItemFrom(data, storage[item]);

			if(match){
				return match;
			}
		}

		else if(storage[item][data[0]] == data[1]){
			return storage[item];

		}

	}

	return match;
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
				storage['projectsTree'][item.title] = { title:item.title, project:'', code:item.code, status:item.status };
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
					storage['projectsTree'][item.project][item.title] = { title:item.title, project:'', code:item.code, status:item.status };
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
				let mainProject = getMainProjectOf(item, storage).title;

				storage['projectAssigned'][mainProject][item.project][item.code] = item;
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
					storageItem[data[0]] = data[1];

					delete storage['projectAssigned'][item.project][item.title];
					delete storage['projectsTree'][item.project][item.title];

					saveItemToStorage(storageItem, storage);
				}

				// from main to sub
				if(item.project == '' && data[1] !== ''){
					let storageItem = JSON.parse(JSON.stringify( storage['projectAssigned'][item.title]));
					storageItem[data[0]] = data[1];

					// main project does NOT exist
					if(!storage['projectsTree'][storageItem.project]){
						let mainProject = new Project(storageItem.project);
						identifyItemAndSave(mainProject, storage);
					}

					delete storage['projectAssigned'][item.title];
					delete storage['projectsTree'][item.title];

					saveItemToStorage(storageItem, storage);
				}
			}

			// check for special case
			else if(data[0] == 'title'){
				let dcItem;
				let dcTree;
				// item is main project
				if(item.project == ''){
					dcItem = JSON.parse(JSON.stringify( storage['projectAssigned'][item.title] ));
					dcItem[data[0]] = data[1];

					dcTree = JSON.parse(JSON.stringify( storage['projectsTree'][item.title] ));
					dcTree[data[0]] = data[1];

					storage['projectAssigned'][dcItem.title] = dcItem;
					storage['projectsTree'][dcTree.title] = dcTree;

					// update all children items
					for(let property in storage['projectAssigned'][dcItem.title]){
						if(property !== 'title' && property !== 'project'
						&& property !== 'status' && property !== 'code'){
							storage['projectAssigned'][dcItem.title][property]['project'] = dcItem.title;
						}
					}

					// update all subprojects
					for(let property in storage['projectsTree'][dcItem.title]){
						if(property !== 'title' && property !== 'project'
						&& property !== 'status' && property !== 'code'){
							storage['projectsTree'][dcItem.title][property]['project'] = dcItem.title;
						}
					}

					delete storage['projectAssigned'][item.title];
					delete storage['projectsTree'][item.title]

				}
				// item is sub project
				if(item.project !== ''){
					let dcItem = JSON.parse(JSON.stringify( storage['projectAssigned'][item.project][item.title] ));
					dcItem[data[0]] = data[1];

					let dcTree = JSON.parse(JSON.stringify( storage['projectsTree'][item.project][item.title] ));
					dcTree[data[0]] = data[1];

					storage['projectAssigned'][dcItem.project][dcItem.title] = dcItem;
					storage['projectsTree'][dcItem.project][dcTree.title] = dcTree;

					// update all children items
					for(let property in storage['projectAssigned'][dcItem.project][dcItem.title]){
						if(property !== 'title' && property !== 'project'
						&& property !== 'status' && property !== 'code'){
							storage['projectAssigned'][dcItem.project][dcItem.title][property]['project'] = dcItem.title;
						}
					}

					// update all subprojects
					for(let property in storage['projectsTree'][dcItem.project][dcItem.title]){
						if(property !== 'title' && property !== 'project'
						&& property !== 'status' && property !== 'code'){
							storage['projectsTree'][dcItem.project][dcItem.title][property]['project'] = dcItem.title;
						}
					}

					delete storage['projectAssigned'][item.project][item.title];
					delete storage['projectsTree'][item.project][item.title]
				}
			}

			// change prop
			else {
				// main project
				if(item.project == ''){
					itemsStorage['projectAssigned'][item.title][data[0]] = data[1]
					itemsStorage['projectsTree'][item.title][data[0]] = data[1];
				}
				// sub project
				else {
					itemsStorage['projectAssigned'][item.project][item.title][data[0]] = data[1];
					itemsStorage['projectsTree'][item.project][item.title][data[0]] = data[1];
				}
			}
		} else {
			console.log(`such property ${data[0]} doesnt exist in the current item`);
		}
	}

	// item is not a project
	else {
		if(item.hasOwnProperty(data[0])){
			// special case: changing projects
			if(data[0] == 'project'){
				// transfer of item is to a project different to where it is at this time.
				if(item.project !== data[1]){
					let dcItem = JSON.parse(JSON.stringify( item ));
					dcItem[data[0]] = data[1];

					// from noProject
					if(item.project == ''){
						console.log('from no project')
						// to main project
						if(storage['projectAssigned'][dcItem.project]){
							storage['projectAssigned'][dcItem.project][dcItem.code] = dcItem;
						}
						// to sub project
						else {
							let mainProject = getMainProjectOf(dcItem, storage).title;
							storage['projectAssigned'][mainProject][dcItem.project][dcItem.code] = dcItem;
						}

						delete storage['noProjectAssigned'][item.code];
					}
					// from main project
					else if(storage['projectAssigned'][item.project]){

						// to no project
						if(data[1] == ''){
							storage['noProjectAssigned'][dcItem.code] = dcItem;
						}

						// to main project
						else if(storage['projectsTree'][data[1]]){
							storage['projectAssigned'][data[1]][dcItem.code] = dcItem;
						}

						// to sub project
						else {
							let mainProject = getMainProjectOf(dcItem, storage).title;
							storage['projectAssigned'][mainProject][dcItem.project][dcItem.code] = dcItem;
						}

						delete storage['projectAssigned'][item.project][item.code];
					}
					// from sub project
					else {
						 item.mainProject = getMainProjectOf(item, storage).title;

						// to no project
						if(data[1] == ''){
							storage['noProjectAssigned'][dcItem.code] = dcItem;
						}

						// to main project
						else if(storage['projectsTree'][dcItem.project]){
							storage['projectAssigned'][dcItem.project][dcItem.code] = dcItem;
						}

						// to sub project
						else {
							let mainProject = getMainProjectOf(dcItem, storage).title;
							storage['projectAssigned'][mainProject][dcItem.project][dcItem.code] = dcItem;
						}

						delete storage['projectAssigned'][item.mainProject][item.project][item.code];
					}
				}
				else{
				console.log(`You can NOT transfer this item to the same project where it already is`);
				}
			}
			else {

				// item is not assigned to a project
				if(item.project == ''){
					storage['noProjectAssigned'][item.code][data[0]] = data[1];
				}

				// item is in main project
				else if(storage['projectAssigned'][item.project]){
					storage['projectAssigned'][item.project][item.code][data[0]] = data[1]
				}

				// item is in sub project
				else {
					let mainProject = getMainProjectOf(item, storage).title;

					storage['projectAssigned'][mainProject][item.project][item.code][data[0]] = data[1]
				}
			}

		} else {
			console.log(`This item does NOT contain the property ${data[0]}`);
		}
	}
}

let project1 = new Project('project1', '');
let project2 = new Project('formerMP', 'project1');
let projectPh = new Project('physics');
let project3 = new Project('windforce', 'physics');
/*identifyItemAndSave(project1, itemsStorage);
identifyItemAndSave(task1, itemsStorage);*/
identifyItemAndSave(project1, itemsStorage);
identifyItemAndSave(project2, itemsStorage);
identifyItemAndSave(projectPh, itemsStorage)
identifyItemAndSave(project3, itemsStorage);

// testing no-projects items
// no project assign
let taskUn = new Task('testing unassigned', '');
identifyItemAndSave(taskUn, itemsStorage);

	// main project
let task4 = new Task('passing around', '');
identifyItemAndSave(task4, itemsStorage);

	// sub project
let task5 = new Task('Inconditionality', 'physics');
identifyItemAndSave(task5, itemsStorage);

	//project does NOT exist
let task6 = new Task('Ana-Gabriel', 'windforce');
identifyItemAndSave(task6, itemsStorage);

let task21 = new Task('premium', 'formermp');
identifyItemAndSave(task21, itemsStorage);


modifyItem(task6, ['title', 'target'], itemsStorage);
console.log(itemsStorage, '1 iteration');
console.log(getItemFrom(['title', 'target'], itemsStorage), 'dinheiro');