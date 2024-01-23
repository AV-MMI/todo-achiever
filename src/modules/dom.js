import * as logic from './logic.js'
import * as data from './data.js';
export { displayGroup, displayMenuComponents, unfoldMenu, displayAllTodos, createObjMenu, handleUserPref}

// DISPLAY
	// TODOS
// takes an array of items returned by data.storage.getObjs(), and display them all in the passed display
function displayAllTodos( objsToDisplay=[], display){
	if(objsToDisplay.length >= 1){
		for(let obj in objsToDisplay){
			if(objsToDisplay[obj].todo){
				displayTodo( objsToDisplay[obj], display );
			}
		}
	}
}

function displayTodo( obj, display ){
	if(obj.todo && obj.type !== 'project'){
		let component = createTodoComponent(obj);
		display.appendChild(component);
	}
}


	// MENUS
function displayMenuComponents( projectsArr, menu ){
	for(let project in projectsArr){
		let menuComponent = createMenuComponent( projectsArr[project] );
		// it is a main project
		if(projectsArr[project]['project'] == ''){
			menu.appendChild(menuComponent);
		}

		// it is a sub project
		else {

			let mainProject = menu.querySelector(`[data-title=${projectsArr[project]['project']}`);
			if(mainProject && menuComponent){
				if(projectsArr[project]['type'] !== 'project'){
					mainProject.insertBefore( menuComponent, mainProject.children[1] );
				} else {
					mainProject.appendChild(menuComponent)
				}
			}
		}
	}
}

	// displaying group of objs
function displayInWindow( objsToDisplay, title, window){
	// set window title
	window.children[0].textContent = title;

	// clean current objs
	cleanDisplay( window.children[1] )
	// display objs
	displayAllTodos( objsToDisplay, window.children[1] );
}

function cleanDisplay(display){
	if(display){
		while(display.hasChildNodes()){
			display.removeChild(display.firstChild)
		}
	}
	return;
}


// COMPONENTS
function createTodoComponent(obj){
// for tasks
	function _createLineItem(obj){
		if(obj){
			// create elements
			let lineCont = document.createElement('div');

			let checkCont = document.createElement('div');
			let checkBtn = document.createElement('button');

			let titleCont = document.createElement('div');
			let itemTitle = document.createElement('span');

			let optionsCont = document.createElement('div');
			let optionsBtn = document.createElement('button');

			// assign classes
			if(obj.type == 'project'){
				lineCont.classList.add('itemProject');
			}

			lineCont.classList.add('line-container', 'item', 'line-item-grid');

			checkCont.classList.add('check-cont', 'c-c-flex');

			checkBtn.classList.add('check-btn');

			titleCont.classList.add('title-cont', 'c-c-flex');

			optionsCont.classList.add('options-cont', 'c-c-flex');
			optionsBtn.classList.add('options-btn');

			// assign id and attributes
			lineCont.setAttribute('id', obj.id);
			lineCont.setAttribute('type', obj.type);
			// in case our item is in a directory
			if(obj.project == 'trash'){
				lineCont.setAttribute('directory', obj.project);
			}
			itemTitle.setAttribute('id', `title-${obj.id}`);
			itemTitle.textContent = obj.title;
			optionsBtn.textContent = '...';

			// add corresponding eventListeners
			checkBtn.addEventListener('click', changeStatus);
			optionsBtn.addEventListener('click', itemOptions);

			// append elements
			lineCont.appendChild(checkCont);
			lineCont.appendChild(titleCont);
			lineCont.appendChild(optionsCont);

			checkCont.appendChild(checkBtn);

			titleCont.appendChild(itemTitle);

			optionsCont.appendChild(optionsBtn);

			// if obj was deleted and deletion is partial
			if(obj.previousProject && data.userSetting.getDeleteVal() == 'partial' || obj.project == 'trash'){
				let wrapper = document.createElement('div');
				let restoreBtn = document.createElement('button');

				wrapper.classList.add('deleted-item', 'v-flex', 'item');

				restoreBtn.textContent = 'restore';
				restoreBtn.classList.add('restore-btn', 'c-c-flex');
				restoreBtn.addEventListener('click', handleRestore);
				lineCont.classList.add('no-margin');

				if(obj.done){
					checkBtn.classList.add('check-btn-done');
					titleCont.classList.add('cross-title');
					if(obj.type == 'task'){
						wrapper.classList.add('opacity-done');
					}
				}

				wrapper.appendChild(restoreBtn);
				wrapper.appendChild(lineCont);

				return wrapper;
			}

			// if delete is complete then there is no need to add restore obj
			if(obj.done && data.userSetting.getDeleteVal() == 'complete' || obj.done && obj.project !== 'trash'){
				checkBtn.classList.add('check-btn-done');
				titleCont.classList.add('cross-title');
				if(obj.type !== 'note' && obj.type !== 'checklist'){
					lineCont.classList.add('opacity-done');
				}
			}
			return lineCont;
		}
	}

	// for checklists and notes
	function _createRecItem(obj){
		if(obj){
			// create elements
			let recWrapper = document.createElement('div');
			let headCont = _createLineItem(obj);
			if(obj.previousProject && data.userSetting.getDeleteVal() == 'partial'){
				headCont.classList.add('no-margin');
				headCont.classList.remove('opacity-done');
			}
				// bottom
			let bottomCont = document.createElement('div');
			if(obj.type == 'note'){
				// creating each p element in base to its paragraph.
				for(let paragraph in obj.text){
					let p = document.createElement('p');
					p.textContent = obj.text[paragraph];
					bottomCont.appendChild(p);
				}
			}

			if(obj.type == 'checklist'){
				// creating each item in checklist
				for(let task in obj.items){
					let taskWrapper = document.createElement('div');
					let checkBtn = document.createElement('button');
					let title = document.createElement('span');

					// getting what class should we use dependin of the state of obj.status
					let status = task.done ? 'status-done' : 'status-pending';
					let crossTitle = task.done ? 'crossTitle' : 'task-title';

					// assign classes
					taskWrapper.classList.add('task-wrapper', 'left-c-flex');
					checkBtn.classList.add('check-btn', status);
					title.classList.add(crossTitle);

					// assign text
					title.textContent = obj.items[task]['title'];

					// append elements
					taskWrapper.appendChild(checkBtn);
					taskWrapper.appendChild(title);

					bottomCont.appendChild(taskWrapper);
				}

				bottomCont.classList.add('checklist-item');
			}

			// assign id and attributes to the wrapper
			recWrapper.setAttribute('id', obj.id);
			recWrapper.setAttribute('type', obj.type);

			// assign classes
			if(obj.done){
				recWrapper.classList.add('opacity-done')

			}
			recWrapper.classList.add('rec-wrapper', 'item');
			bottomCont.classList.add('rec-bottom');

			// append element
			recWrapper.appendChild(headCont);
			recWrapper.appendChild(bottomCont);

			return recWrapper;
		}
	}

	if(obj){
		let component;
		if(obj.type == 'task'){
			logic.createItem(obj);
			component = _createLineItem(obj);
		} else {
			logic.createItem(obj);
			component = _createRecItem(obj);
		}

		return component;
	}
}

// allow us to create directories for directories/projects/overview menu
function createMenuComponent(obj){
	if(obj.type){
		let ul = document.createElement('ul');
		let li = document.createElement('li');
		let span = document.createElement('span');

		ul.setAttribute('data-title', obj.title);
		let projectItemClass = obj.type == 'project' ? 'project-item' : 'non-project-item';
		let doneItemClass = obj.done ? 'done-item' : 'non-done-item';
		li.classList.add('menu-item', projectItemClass, doneItemClass);
		li.addEventListener('click', displayGroup);
		span.textContent = obj.title;
		span.setAttribute('data-project', obj.id);

		ul.appendChild(li);
		li.appendChild(span);
		return ul;
	}
}

function createBasicMenu(obj={}){
	let menuWrap = document.createElement('div');
	let ul = document.createElement('ul');

	menuWrap.classList.add('obj-menu');
	if(obj.id){
		menuWrap.setAttribute('id', obj.id);
	}

	ul.classList.add('ul-menu')

	menuWrap.appendChild(ul);
	return menuWrap;
}

// allow us to create a menu component for each passed obj
function createObjMenu(obj){
	let basicMenu = createBasicMenu(obj);
	let ul = basicMenu.querySelector('.ul-menu');
	let liDelete = document.createElement('li');
	let liUpdate = document.createElement('li');
	let liComplete = document.createElement('li');

	[liDelete, liUpdate, liComplete].forEach((li) => li.classList.add('obj-menu-opt'));
	liDelete.setAttribute('data-opt', 'delete');
	liUpdate.setAttribute('data-opt', 'update');
	liComplete.setAttribute('data-opt', 'complete');

	liDelete.textContent = 'Delete';
	liUpdate.textContent = 'Update';
	liComplete.textContent = obj.done ? 'Uncomplete' : 'Complete';

	[liDelete, liUpdate, liComplete].forEach((li) => ul.appendChild(li));
	[liDelete, liUpdate, liComplete].forEach((li) => li.addEventListener('click', objMenuHandler));



	return basicMenu;
}

// menu for user preferences
function createUserPrefMenu(obj=data.userSetting){
	let basicMenu = createBasicMenu();
	let ul = basicMenu.getElementsByClassName('ul-menu')[0];
	let liRemove = document.createElement('li');
	let removeLabel = document.createElement('label');
	let removeSelect = document.createElement('select');
	let partialOpt = document.createElement('option');
	let completeOpt = document.createElement('option');

	let liStorage = document.createElement('li');
	let storageLabel = document.createElement('label');
	let storageSelect = document.createElement('select');
	let localOpt = document.createElement('option');
	let noneOpt = document.createElement('option');

	let liSetBtn = document.createElement('li');
	let setBtn = document.createElement('button');

	// remove
	removeLabel.textContent = 'remove';
	partialOpt.value = 'partial';
	partialOpt.textContent = 'partial';

	completeOpt.value = 'complete';
	completeOpt.textContent = 'complete';

	// storage
	storageLabel.textContent = 'storage';
	localOpt.value = 'local';
	localOpt.textContent = 'local';

	noneOpt.value = 'none';
	noneOpt.textContent = 'none';

	[localOpt, noneOpt].forEach( (opt) => { if(obj.storage[obj.value]){ opt.setAttribute('selected', true) } });

	// set btn
	setBtn.classList.add('set-btn');
	setBtn.textContent = 'set preferences';

	[liRemove, liStorage, liSetBtn].forEach( (opt) => { opt.classList.add('menu-item') });
	[removeSelect, storageSelect].forEach( (select) => { select.classList.add('select') });
	removeLabel.setAttribute('for', 'remove-select');
	removeSelect.setAttribute('id', 'remove-select');

	storageLabel.setAttribute('for', 'storage-select');
	storageSelect.setAttribute('id', 'storage-select');

	basicMenu.appendChild(ul);
	ul.appendChild(liRemove);
	ul.appendChild(liStorage);
	ul.appendChild(liSetBtn);

	liRemove.appendChild(removeLabel);
	liRemove.appendChild(removeSelect);
	removeSelect.appendChild(partialOpt);
	removeSelect.appendChild(completeOpt);

	liStorage.appendChild(storageLabel);
	liStorage.appendChild(storageSelect);
	storageSelect.appendChild(localOpt);
	storageSelect.appendChild(noneOpt);

	liSetBtn.appendChild(setBtn);

	setBtn.addEventListener('click', setPrefValues);

	return basicMenu
}

function createCentralWindowAlert(){
	let wrapper = document.createElement('div');
	let background = document.createElement('div');
	let divWindow = document.createElement('div');

	wrapper.classList.add('wrapper-alert');
	background.classList.add('background-alert');
	divWindow.classList.add('central-window-alert');

	wrapper.appendChild(background);
	wrapper.appendChild(divWindow);

	background.addEventListener('click', closeAlert);
	return wrapper;
}

// event listeners
	// menus
function unfoldMenu(e){
	e.target.parentElement.children[1].classList.toggle('menu-unfold');
}


function displayGroup(e){
	let projectObj = data.storage.getObj(['id', e.target.getAttribute('data-project')]);
	let displayWindow = document.getElementById('display-window');
	let projectItems;
	if(projectObj !== undefined){
		projectItems = data.storage.getObjs(['project', projectObj.title]);

	} else {
		if(e.target.getAttribute('data-project') == 'unassigned'){
			projectItems = data.storage.getObjs(['project', ''], data.storage.objs);
			projectObj = {title: 'Unassigned'};
		}
		else if(e.target.getAttribute('data-project') == 'trash'){
			projectItems = data.storage.getObjs(['project', 'trash'], data.storage.objs.trash);
			projectObj = {title: 'Trash'};
		}
		else if(e.target.getAttribute('data-project') == 'completed'){
			projectItems = data.storage.getObjs(['done', true], data.storage.objs);
			projectObj = {title: 'Completed'};
		}
	}

	displayInWindow(projectItems, projectObj.title, displayWindow);
}

	// items
function changeStatus(e){
	let overviewMenu = document.getElementById('overview-menu');
	let lineItem = e.target.parentElement.parentElement;
	let obj = data.storage.getObj(['id', lineItem.getAttribute('id')]) || data.storage.getObj(['id', lineItem.getAttribute('id')], data.storage.objs[ lineItem.getAttribute('directory') ]);

	if(obj){
		// check item
		let checkBtn = lineItem.querySelector('.check-btn');
		checkBtn.classList.toggle('check-btn-done');

		// cross title
		let title = lineItem.querySelector('.title-cont');
		title.classList.toggle('cross-title');

		// item opacity
		if(obj.project == 'trash'){
			if(obj.type == 'task'){
				lineItem.parentElement.classList.toggle('opacity-done');
			} else {
				lineItem.parentElement.parentElement.classList.toggle('opacity-done');
			}
		} else {
			if(obj.type == 'task'){
				lineItem.classList.toggle('opacity-done');
			} else {
				lineItem.parentElement.classList.toggle('opacity-done');
			}
		}

		// update prop
		obj.done = obj.done ? false : true;
	}

	// update overview menu
	cleanDisplay(overviewMenu)
	displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
}

/*
 EVENT HANDLER
 In charge of the process of displaying and removing the item options menu for each project.
*/

function itemOptions(e){
	let buttonTarget = e.target;
	let lineComponent = e.target.parentElement.parentElement;
	let obj = data.storage.getObj(['id', lineComponent.getAttribute('id')]) || data.storage.getObj(['id', lineComponent.getAttribute('id')], data.storage.objs[ lineComponent.getAttribute('directory') ]);
	let menuAppended = lineComponent.getElementsByClassName('obj-menu');

	// if obj is valid it means that it come from projects and not from trash
	if(!obj){
		obj = data.storage.getObj(['id', lineComponent.getAttribute('id')], data.storage.objs[lineComponent.getAttribute('directory')]);
	}
	// menu has not been opened, son open it !
	if(obj && menuAppended.length == 0){
		let objMenu = createObjMenu(obj);
		lineComponent.lastChild.appendChild(objMenu);
		if(obj.project !== 'trash'){
			if(obj.type == 'task'){
				lineComponent.classList.add('line-n-Menu');
			}
			// obj is in trash, so counts with restore button
		} else {
			if(obj.type == 'task'){
				lineComponent.parentElement.classList.add('line-n-Menu');
			}
		}
 	} else {
		menuAppended = lineComponent.getElementsByClassName('obj-menu');
		menuAppended[0].remove();
		if(obj.project !== 'trash'){
			if(obj.type == 'task'){
				lineComponent.classList.remove('line-n-Menu');
			}
			// obj is in trash, so counts with restore button
		} else {
			if(obj.type == 'task'){
				lineComponent.parentElement.classList.remove('line-n-Menu');
			}
		}
	}

	return;
}

// Handler for objs components menu: delete, update, complete
function objMenuHandler(e){
	let overviewMenu = document.getElementById('overview-menu');
	let lineComponent = e.target.parentElement.parentElement.parentElement.parentElement;
	let obj = data.storage.getObj(['id', lineComponent.getAttribute('id')]);
	if(e.target.getAttribute('data-opt') == 'delete'){
		_handleDelete(e);

		// update overview menu
		cleanDisplay(overviewMenu)
		displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
	}
	else if(e.target.getAttribute('data-opt') == 'update'){
		function _createUlUpdateMenu(obj){
			let ul = document.createElement('ul');
			let liTitle = document.createElement('li');
			let titleInput = document.createElement('input');

			let liSelect = document.createElement('li');
			let selectLabel = document.createElement('label');
			let selectEl = document.createElement('select');

			let liUpdateBtn = document.createElement('li');
			let updateBtn = document.createElement('button');

			liTitle.classList.add('obj-menu-opt');
			titleInput.setAttribute('type', 'text');
			titleInput.setAttribute('maxlength', '25');
			titleInput.setAttribute('value', obj.title);
			titleInput.setAttribute('name', 'title');
			titleInput.setAttribute('id', 'title-input');

			selectLabel.textContent = 'select new project';
			selectLabel.setAttribute('for', 'select-project');

			selectEl.classList.add('select')
			selectEl.setAttribute('id', 'select-project');

			updateBtn.textContent = 'update obj';
			updateBtn.classList.add('update-btn');

			[liTitle, liSelect, liUpdateBtn].forEach((li) => {
				li.classList.add('obj-menu-opt');
			})
			// get projects to make each option
			let projects = data.storage.getObjs(['type', 'project']);
			if(projects){
				let proOpt;
				projects.forEach((project) => {
					proOpt = document.createElement('option');
					proOpt.value=`${project.title}`;
					proOpt.textContent = `${project.title}`;

					if(project.title == obj.project){
						proOpt.setAttribute('selected', true);
					}
					selectEl.appendChild(proOpt);
				});
				proOpt = document.createElement('option');
				proOpt.value=`${''}`;
				proOpt.textContent = 'unassigned';
				if(proOpt.value == obj.project){
					proOpt.setAttribute('selected', true);
				}
				selectEl.appendChild(proOpt);
			}



			[selectLabel, selectEl].forEach((select) => liSelect.appendChild(select));
			liTitle.appendChild(titleInput);
			liUpdateBtn.appendChild(updateBtn);
			[liTitle, liSelect, liUpdateBtn].forEach((li) => ul.appendChild(li));

			updateBtn.addEventListener('click', _handleUpdate);
			return ul;
		}

		e.target.parentElement.parentElement.appendChild(_createUlUpdateMenu(obj));
		e.target.parentElement.parentElement.firstChild.remove();

		return;
	}
	else if(e.target.getAttribute('data-opt') == 'complete'){
		lineComponent.children[0].children[0].click();

		// delete menu and redisplay!
		lineComponent.children[2].children[0].click();
		lineComponent.children[2].children[0].click();

		// update overview menu
		cleanDisplay(overviewMenu)
		displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
	}
}

	// Handler for Delete
function _handleDelete(e){
	let lineCont = e.target.parentElement.parentElement.parentElement.parentElement;
	let obj = data.storage.getObj(['id', lineCont.getAttribute('id')]) || data.storage.getObj(['id', lineCont.getAttribute('id')], data.storage.objs[lineCont.getAttribute('directory')]);

	if(data.userSetting.getDeleteVal() == 'partial' && obj.previousProject){
		let topComponent = lineCont.parentElement;
		if(obj.type !== 'task'){
			topComponent = topComponent.parentElement;
		}

		data.storage.removeObj(obj);
		topComponent.remove();
		return;
	}
	// deletion process is complete. OR, our deletion process is partial and our item
	// is out of trash
	else if(data.userSetting.getDeleteVal() == 'complete' || !obj.hasOwnProperty('previousProject')){
		let topComponent = lineCont;
		if(obj.type !=='task'){
			topComponent = topComponent.parentElement;
		}

		data.storage.removeObj(obj);
		topComponent.remove();

		if(data.userSetting.getDeleteVal() == 'partial'){
			let objClone = JSON.parse(JSON.stringify(obj));
			objClone.previousProject = obj.project;
			objClone.project = 'trash';
			data.storage.addObj(objClone, data.storage.objs['trash']);
		}
	}
}

	// Handlers for update, objs menu

	// Handler for update
function _handleUpdate(e){
	let ul = e.target.parentElement.parentElement;
	let lineCont = ul.parentElement.parentElement.parentElement;
	let optionsBtn = lineCont.querySelector('.options-btn');
	let obj = data.storage.getObj(['id', lineCont.getAttribute('id')]);

	let inputTitle = ul.querySelector('#title-input');
	let selectEl = ul.querySelector('#select-project');
	let objCopy = JSON.parse(JSON.stringify(obj));
	let overviewMenu = document.getElementById('overview-menu');

	if(inputTitle.value !== obj.title){
		let itemTitle = lineCont.querySelector(`#title-${obj.id}`);
		itemTitle.textContent = inputTitle.value;

		objCopy.title = inputTitle.value;
		data.storage.removeObj(obj);
		data.storage.addObj(objCopy);
	}

	if(selectEl.value !== obj.project){
		objCopy.project = selectEl.value;

		data.storage.removeObj(obj);
		if(data.storage.uniqueAtLevel(objCopy)){
			if(lineCont.getAttribute('type') == 'task'){
				lineCont.remove();
			}

			else if(lineCont.getAttribute('type') == 'note' || lineCont.getAttribute('type') == 'checklist'){
				let recWrap = lineCont.parentElement;
				recWrap.remove();
			}

			data.storage.addObj(objCopy);

		} else {
			alert('there is another item with that title in the selected project');
		}
	}

	// close menu
	optionsBtn.click();
	// update overview menu
	cleanDisplay(overviewMenu)
	displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
}

// handler for user preference
function handleUserPref(e){
	let alert = createCentralWindowAlert();
	let centralWindow = alert.getElementsByClassName('central-window-alert')[0];
	let background = alert.getElementsByClassName('background-alert')[0]
	let userPrefMenu = createUserPrefMenu();

	centralWindow.appendChild(userPrefMenu);
	let main = document.getElementsByTagName('main')[0];
	main.appendChild(alert);
}

function closeAlert(e){
	e.target.parentElement.remove();
	return;
}

function setPrefValues(e){
	let ulMenu = e.target.parentElement.parentElement;
	let alertBackground = document.getElementsByClassName('background-alert')[0];
	let removeSel = ulMenu.querySelector('#remove-select');
	let storageSel = ulMenu.querySelector('#storage-select');

	if(removeSel.value !== data.userSetting['delete'][removeSel.value]){
		data.userSetting.setDelete(removeSel.value);
	}

	if(storageSel.value !== data.userSetting['storage'][storageSel.value]){
		data.userSetting.setStorage(storageSel.value);
	}

	alertBackground.click();
}

function handleRestore(e){
}