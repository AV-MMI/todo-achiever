import * as logic from './logic.js'
import * as data from './data.js';
export { displayObjs, displayObj }

// DISPLAY
function displayObjs( obj, display){
	return;
}

function displayObj( obj, display ){
	let component = createComponent(obj);
	console.log(display, component)
	display.appendChild(component);
}

// COMPONENTS

function createComponent(obj){
	console.log(obj, '<-component')
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
function createProject(obj){
	//data.identifyItemAndSave(tempPro);
	tempItem = logic.createItem(item);


	if(item.project == ""){

	}
	else {

	}
}

// event listeners

function changeStatus(e){
	let itemId = (e.target.parentElement.parentElement.id);
	//let item = data.
}

function deleteItem(e){
	alert('deleteItem')
	return;
}