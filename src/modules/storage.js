import * as utilities from './utilities.js'

/* storage.js
 In charge of

*/

export { getItemsStorage, identifyItemAndSave,  }

const itemsStorage = {
	counter: 0,

	projectAssigned: { depot: true },
	noProjectAssigned: { depot: true },
	projectsTree: {
		unassigned: {},
	}
}

// high level function - to export
const getItemsStorage = () => {
	return itemsStorage;
}


// high level function
//  This function takes an item and a storage object as input, and saves the item
// in the storage object and assign to it a code property to identify it.
function identifyItemAndSave(item={}, storage={}){
	assignCodetoItem(item, storage);
	saveItemToStorage(item, storage);

	return
}

// low level func - helper of identifyItemAndSave
// takes an item and storage object as input, and
// assigns to item a code composed
function assignCodetoItem(item, storage){
	// Obtain first letter identifier;
	let letter = utilities.getTypeOfItem(item);
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

// low level function - helper of identifyItemAndSave
function saveItemToStorage(item={}, storage={}){

	let typeOfItem = utilities.getTypeOfItem(item);
	// item is a project
	if(typeOfItem == 'project'){
		// item is main project
		if(item.project == ''){
			if(utilities.isUniqueThisItemInItsLevel(item, storage)){
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
				if(utilities.isUniqueThisItemInItsLevel(item, storage)){
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

			else if(!storage['projectsTree'][item.project] && utilities.getMainProjectOf(item, storage)){
				let mainProject = utilities.getMainProjectOf(item, storage).title;

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
