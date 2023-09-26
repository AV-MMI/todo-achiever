export { getTypeOfItem, getItemFrom, isUniqueThisItemInItsLevel, getMainProjectOf }

function getTypeOfItem(item){
	return item.constructor.name.toLowerCase();
}

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

// function: gets the main project from the item passed.
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
