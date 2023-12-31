import * as logic from './logic.js'
import * as data from './data.js';
export { displayAllTodos, displayTodo, displayMenuComponents, unfoldMenu }

// DISPLAY
	// TODOS
function displayAllTodos( storage, display){
	if(Object.keys(storage).length > 0){
		// checking non-projects at this level to display them all!
		for(let obj in storage){
			if(storage[obj]['type'] !==  'project'){
				displayTodo( storage[obj], display );
			}
		}

		// checking projects at this storage to display and go through them
		for(let obj in storage){
			if(storage[obj]['type'] == 'project'){
				return displayAllTodos( storage[obj], display );
			}
		}

	}
}

function displayTodo( obj, display ){
	if(obj.id){
		let component = createTodoComponent(obj);
		display.appendChild(component);
	}
}


	// MENUS
function displayMenuComponents( projectsArr, menu ){
	for(let project in projectsArr){
		let projectComponent = createMenuComponent( projectsArr[project] );

		// it is a main project
		if(projectsArr[project]['project'] == ''){
			menu.appendChild(projectComponent);
		}

		// it is a sub project
		else {
			let mainProject = menu.querySelector(`[data-title=${projectsArr[project]['project']}`);
			if(mainProject){
				console.log(mainProject, projectsArr[project]['project'], '<-<-->->');
				mainProject.appendChild(projectComponent)
			}
		}
	}
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

			let deleteCont = document.createElement('div');
			let deleteBtn = document.createElement('button');

			// assign classes
			if(obj.type == 'project'){
				lineCont.classList.add('itemProject');
			}

			lineCont.classList.add('line-container', 'item', 'line-item-grid');

			checkCont.classList.add('check-cont', 'c-c-flex');

				// get what class should we use depending on the state of the item.status
			let statusClass = obj.done ? 'check-btn-done' : 'noclass';

			checkBtn.classList.add('check-btn', statusClass);

			titleCont.classList.add('title-cont', 'c-c-flex');

			deleteCont.classList.add('delete-cont', 'c-c-flex');
			deleteBtn.classList.add('delete-btn');

			// assign content
			lineCont.setAttribute('id', obj.id);
			itemTitle.textContent = obj.title;
			deleteBtn.textContent = '...';

			// add corresponding eventListeners
			checkBtn.addEventListener('click', changeStatus);
			deleteBtn.addEventListener('click', deleteItem);

			// append elements
			lineCont.appendChild(checkCont);
			lineCont.appendChild(titleCont);
			lineCont.appendChild(deleteCont);

			checkCont.appendChild(checkBtn);

			titleCont.appendChild(itemTitle);

			deleteCont.appendChild(deleteBtn);

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

			// assign id to the wrapper
			recWrapper.setAttribute('id', obj.id)

			// assign classes
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
	if(obj){
		let ul = document.createElement('ul');
		let li = document.createElement('li');
		let span = document.createElement('span');

		ul.setAttribute('data-title', obj.title);
		let dormantClass = obj.type == 'project' ? 'project-item' : 'non-project-item';
		console.log(obj.type, dormantClass, '<--------------------')
		li.classList.add('projects-menu-item', dormantClass);
		span.textContent = obj.title;

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

	// items
function changeStatus(e){
	let itemId = (e.target.parentElement.parentElement.id);
	//let item = data.
}

function deleteItem(e){
	alert('deleteItem')
	return;
}