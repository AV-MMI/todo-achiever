import * as logic from './logic.js'
import * as data from './data.js';
export { displayGroup, displayMenuComponents, unfoldMenu, displayAllTodos }

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

				// get what class should we use depending on the state of the item.status
			if(obj.done){
				checkBtn.classList.add('check-btn-done');
				titleCont.classList.add('cross-title');
				if(obj.type !== 'note' && obj.type !== 'checklist'){
					lineCont.classList.add('opacity-done')
				}
			}

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
			itemTitle.textContent = obj.id;
			optionsBtn.textContent = '...';

			// add corresponding eventListeners
			checkBtn.addEventListener('click', changeStatus);
			optionsBtn.addEventListener('click', deleteItem);

			// append elements
			lineCont.appendChild(checkCont);
			lineCont.appendChild(titleCont);
			lineCont.appendChild(optionsCont);

			checkCont.appendChild(checkBtn);

			titleCont.appendChild(itemTitle);

			optionsCont.appendChild(optionsBtn);

			return lineCont;
		}
	}

	// for checklists and notes
	function _createRecItem(obj){
		if(obj){
			// create elements
			let recWrapper = document.createElement('div');
			let headCont = _createLineItem(obj);
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

// allow us to create direc
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
			projectItems = data.storage.getObjs(['project', '']);
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

	displayInWindow(projectItems, projectObj.title, displayWindow)

}

	// items
function changeStatus(e){
	let overviewMenu = document.getElementById('overview-menu');
	let component = e.target.parentElement.parentElement
	let directory = component.getAttribute('directory');
	let obj;

	if(directory){
		obj = data.storage.getObj(['id', component.getAttribute('id')], data.storage.objs[directory]);
	} else {
		obj = data.storage.getObj(['id', component.getAttribute('id')]);
	}


	if(component.getAttribute('type') == 'note' || component.getAttribute('type') == 'checklist'){
		component = component.parentElement;
		if(obj){
			component.children[0].children[0].children[0].classList.toggle('check-btn-done');
			component.children[0].children[1].classList.toggle('cross-title');
			component.classList.toggle('opacity-done');
			obj.done = obj.done == true ? false : true;
		}

	} else {
		if(obj){
			component.children[0].children[0].classList.toggle('check-btn-done');
			component.children[1].classList.toggle('cross-title');
			component.classList.toggle('opacity-done');
			obj.done = obj.done == true ? false : true;
		}
	}
	
	cleanDisplay(overviewMenu)
	displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
}

function deleteItem(e){
	alert('deleteItem')
	return;
}