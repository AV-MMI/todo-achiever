import * as crud from './crud.js'
import * as repository from './repository.js';
import * as utilities from './utilities.js';

export { createLineItem, createRecItem };

// for projects and tasks
function createLineItem(item){
	// create elements
	let lineCont = document.createElement('div');

	let checkCont = document.createElement('div');
	let checkBtn = document.createElement('button');

	let titleCont = document.createElement('div');
	let itemTitle = document.createElement('span');

	let deleteCont = document.createElement('div');
	let deleteBtn = document.createElement('button');

	// assign classes
	if(utilities.getTypeOfItem(item) == 'project'){
		lineCont.classList.add('itemProject');
	}

	lineCont.classList.add('line-container', 'item', 'crud-grid');

	checkCont.classList.add('check-cont', 'c-c-flex');

		// get what class should we use depending on the state of the item.status
	let statusClass = (()=>{
		if(item.status == 'pending'){
			return 'check-btn-pending';
		}

		else if(item.status == 'progress'){
			return 'check-btn-progress';
		}

		else if(item.status == 'done'){
			return 'check-btn-done';
		}
	})();

	checkBtn.classList.add('check-btn', statusClass);

	titleCont.classList.add('title-cont', 'c-c-flex');

	deleteCont.classList.add('delete-cont', 'c-c-flex');
	deleteBtn.classList.add('delete-btn');

	// assign content
	lineCont.setAttribute('id', item.code);
	checkBtn.textContent = '[O]';
	itemTitle.textContent = item.title;
	deleteBtn.textContent = '[X]';

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
function createRecItem(item){
	// create elements
	let recWrapper = document.createElement('div');
	let headCont = createLineItem(item);

		// bottom
	let bottomCont = document.createElement('div');
	if(utilities.getTypeOfItem(item) == 'note'){
		// creating each p element in base to its paragraph.
		for(let paragraph in item.text){
			let p = document.createElement('p');
			p.textContent = item.text[paragraph];
			bottomCont.appendChild(p);
		}
	}

	if(utilities.getTypeOfItem(item) == 'checklist'){
		// creating each item in checklist
		console.log('it is a checklist');
		for(let task in item.items){
			console.log(item.items[task], '<<<------ Task');
			let taskWrapper = document.createElement('div');
			let pointBtn = document.createElement('button');
			let title = document.createElement('span');

			// getting what class should we use dependin of the state of item.status
			let status = task.done ? 'status-done' : 'status-pending';
			let crossTitle = task.done ? 'crossTitle' : 'task-title';

			// assign classes
			taskWrapper.classList.add('task-wrapper', 'left-c-flex');
			pointBtn.classList.add('point-btn', status);
			title.classList.add(crossTitle);

			// assign text
			title.textContent = item.items[task]['title'];

			// append elements
			taskWrapper.appendChild(pointBtn);
			taskWrapper.appendChild(title);

			bottomCont.appendChild(taskWrapper);
		}
	}

	// assign classes
	recWrapper.classList.add('rec-wrapper', 'item');
	bottomCont.classList.add('rec-bottom');

	// append element
	recWrapper.appendChild(headCont);
	recWrapper.appendChild(bottomCont);

	return recWrapper;
}