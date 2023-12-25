import * as logic from './logic.js'
import * as data from './data.js';


// for projects and tasks
function _createLineItem(item){
	// create elements
	let lineCont = document.createElement('div');

	let checkCont = document.createElement('div');
	let checkBtn = document.createElement('button');

	let titleCont = document.createElement('div');
	let itemTitle = document.createElement('span');

	let deleteCont = document.createElement('div');
	let deleteBtn = document.createElement('button');

	// assign classes
	if(item.type == 'project'){
		lineCont.classList.add('itemProject');
	}

	lineCont.classList.add('line-container', 'item', 'crud-grid');

	checkCont.classList.add('check-cont', 'c-c-flex');

		// get what class should we use depending on the state of the item.status
	let statusClass = item.done ? 'check-btn-done' : 'noclass';

	checkBtn.classList.add('check-btn', statusClass);

	titleCont.classList.add('title-cont', 'c-c-flex');

	deleteCont.classList.add('delete-cont', 'c-c-flex');
	deleteBtn.classList.add('delete-btn');

	// assign content
	lineCont.setAttribute('id', item.id);
	itemTitle.textContent = item.title;
	deleteBtn.textContent = '[X]';

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

// for checklists and notes
function _createRecItem(item){
	// create elements
	let recWrapper = document.createElement('div');
	let headCont = _createLineItem(item);
		// bottom
	let bottomCont = document.createElement('div');
	if(item.type == 'note'){
		// creating each p element in base to its paragraph.
		for(let paragraph in item.text){
			let p = document.createElement('p');
			p.textContent = item.text[paragraph];
			bottomCont.appendChild(p);
		}
	}

	if(item.type == 'checklist'){
		// creating each item in checklist
		for(let task in item.items){
			let taskWrapper = document.createElement('div');
			let checkBtn = document.createElement('button');
			let title = document.createElement('span');

			// getting what class should we use dependin of the state of item.status
			let status = task.done ? 'status-done' : 'status-pending';
			let crossTitle = task.done ? 'crossTitle' : 'task-title';

			// assign classes
			taskWrapper.classList.add('task-wrapper', 'left-c-flex');
			checkBtn.classList.add('check-btn', status);
			title.classList.add(crossTitle);

			// assign text
			title.textContent = item.items[task]['title'];

			// append elements
			taskWrapper.appendChild(checkBtn);
			taskWrapper.appendChild(title);

			bottomCont.appendChild(taskWrapper);
		}

		bottomCont.classList.add('checklist-item');
	}

	// assign id to the wrapper
	recWrapper.setAttribute('id', item.id)

	// assign classes
	recWrapper.classList.add('rec-wrapper', 'item');
	bottomCont.classList.add('rec-bottom');

	// append element
	recWrapper.appendChild(headCont);
	recWrapper.appendChild(bottomCont);

	return recWrapper;
}

// function in charge of reducing the number of invokations to 1 from 4 in the process of creating
// an item component. It will take an serie of inputs which will be the property of the object, and will
// create the component in base to its type.
function createItemComponent(item){
	if(item){
		let tempItem;
		if(item.type == 'task'){
			tempItem = new logic.Task(item.title, item.project, item.done);
			//data.identifyItemAndSave(tempItem, data.getStorage());
			tempItem = _createLineItem(tempItem);
		} else {
			tempItem = item.type == 'note' ? new logic.Note(item.title, item.project, item.done, item.type, item.text) : new logic.Checklist(item.title, item.project, item.done, item.type, item.items);
			//data.identifyItemAndSave(tempItem, data.getStorage());
			tempItem = _createRecItem(tempItem);
		}

		return tempItem;
	}
}

// allow us to create direc
function createProject(item){
	let tempPro = new logic.Project(item.title, item.project, item.done);
	//data.identifyItemAndSave(tempPro);


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