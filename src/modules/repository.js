import * as utilities from './utilities.js'
import * as crud from './crud.js'
export { getProjectPath, getItems, identifyItemAndSave, removeItem, modifyItem, getItemFrom }

const _itemsStorage = {
	counter: 0,

	projectAssigned: {depot: true, },
	noProjectAssigned: {depot: true, }
}

// high level function - to export
function getItems(){
	return _itemsStorage;
}

//
// returns an array with the route of projects in which is nested projectTitle.
function getProjectPath(projectTitle, storage){
	let project = getItemFrom(['title', projectTitle], storage);
	let route = [];

	while(project){
		route.unshift(project.title);
		project = getItemFrom(['title', project['project']], storage);
	}
	return route;
}

// high level function
//  This function takes an item and a storage object as input, and saves the item
// in the storage object and assign to it a code property to identify it.
function identifyItemAndSave(item={}, storage=getItems()){
	_assignCodetoItem(item, storage);
	_saveItemToStorage(item, storage);

	return
}

// low level func - helper of identifyItemAndSave
// takes an item and storage object as input, and
// assigns to item a code composed
function _assignCodetoItem(item, storage){
	// Obtain first letter identifier;
	let letter = utilities.getTypeOfItem(item)[0];
	let code = `${letter}${_itemsStorage.counter}`;
	_itemsStorage.counter++;

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

// low level function - helper of _saveItemToStorage
// it takes three parameters:
// route param: to go through the storage obj.
// storage param: object that stores all our projects and non-project items.
// item param is the item to be appended to the last project on route,
// n param: act as a pointer for route during recursion.

function _addItem(item, route=[], storage, n=0){
	if(storage){
		if(storage['title'] == item.project){
			if(utilities.getTypeOfItem(item) == 'project'){
				storage[item.title] = item;
			} else {
				storage[item.code] = item;
			}
		} else {
			_addItem(item, route, storage[route[n]], n+1)
		}
	}

	return
}

// low level function - helper of identifyItemAndSave
function _saveItemToStorage(item={}, storage=getItems()){
	if(item){
		// is assigned
		if(item.project !== ''){
			let projectPath = getProjectPath(item.project, storage);
			_addItem(item, projectPath, storage['projectAssigned']);
		}
		// it is not assigned
		else {
			if(utilities.getTypeOfItem(item) == 'project' || item['code'][0] == 'p'){
				storage['projectAssigned'][item.title] = item;
			}
			else {
				storage['noProjectAssigned'][item.code] = item;
			}
		}
	}
}

// high level function - to export
function removeItem(item, storage, route=[], n=0){
	if(utilities.getTypeOfItem(item) == 'project' || item.project !== ''){
		if(storage){
			if(storage['title'] == item.project){
				if(utilities.getTypeOfItem(item) == 'project'){
					delete storage[item.title];
				} else {
					delete storage[item.code];
				}
			}
			else {
				removeItem(item, storage[route[n]], route, n+1);
			}
		}
	}
	else {
		delete storage[item.code];
	}
}

// an special case is when a change requires more than just reassign the new value
function modifyItem(item, data, storage, route, n=0){
	if(storage){
		if(storage['title'] == item.project || route.length == 0){
			// item is a project -->
			if(utilities.getTypeOfItem(item) == 'project'){
				//special cases for project
					// modify project property: change a project to main, or sub.
				if(data[0] == 'project'){
					storage[item.title][data[0]] = data[1];
					_saveItemToStorage(storage[item.title]);
					delete storage[item.title];
				}

					//modify title property
				else if(data[0] == 'title'){

					let itemChildren = Object.keys(storage[item.title]);
						// obtain child items and change their correspondent prop to match the new title
						for(let child in itemChildren){
							if(itemChildren[child] !== 'title' && itemChildren[child] !== 'project' && 
								itemChildren[child] !== 'status' && itemChildren[child] !== 'code'){
								storage[item.title][itemChildren[child]]['project'] = data[1];
							};
						}

						// assign new title to project
						let tmpItem = JSON.parse(JSON.stringify(storage[item.title]));
						tmpItem[data[0]] = data[1];
						_saveItemToStorage(tmpItem);

						delete storage[item.title];
				}

					//normal case
				else {
					storage[item.title][data[0]] = data[1];
				}
			}

			// <-- item is a project

			// item is NOT a project
			else {
				// special cases for non-project
					// modify project prop
				if(data[0] == 'project'){
					let tmpItem = JSON.parse(JSON.stringify(storage[item.code]));
					tmpItem[data[0]] = data[1];

					delete storage[item.code];
					_saveItemToStorage(tmpItem);
				}

				else {
					// normal case
					storage[item.code][data[0]] = data[1];
				}
			}
		}
		else {
			modifyItem(item, data, storage[route[n]], route, n+1);
		}
	}
}

function getItemFrom(data=[], storage={}){
	let match = false;

	for(let item in storage){
		if(storage[item][data[0]] == data[1]){
			return storage[item];

		}

		else if(storage[item]['depot'] || utilities.getTypeOfItem(storage[item]) == 'project'){
			match = getItemFrom(data, storage[item]);

			if(match){
				return match;
			}
		}
	}

	return match;
}
