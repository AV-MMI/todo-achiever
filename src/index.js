import './styles/styles.css';
import './styles/dom.css';

import * as dom from './modules/dom.js';
import * as logic from './modules/logic.js'
import * as data from './modules/data.js';

let dummyProject1 = {
	title: 'pro1',
	project: '',
	done: false,
	type: 'project',
}

	let dummyProject2 = {
	title: 'pro2',
	project: 'pro1',
	done: false,
	type: 'project',
}

let dummyProject3 = {
	title: 'pro3',
	project: 'pro2',
	done: false,
	type: 'project',
}

let dummytest = {
	title: 'test',
	project: '',
	done: false,
	type: 'task',
}

let dummytest1 = {
	title: 'pro1',
	project: '',
	done: false,
	type: 'task',
}

let dummyTask1 = {
	title: 'dTask1',
	project: 'pro1',
	done: false,
	type: 'task',
}

let dummyTask2 = {
	title: 'dTask2',
	project: 'pro3',
	done: false,
	type: 'task',
}

let dummyTask3 = {
	title: 'dTask3',
	project: 'pro3',
	done: false,
	type: 'task',
}

let dummyChecklist = {
	title: 'weekly buying',
	project: '',
	done: false,
	type: 'checklist',
	items: [{'done': false, 'title': 'lettuce'},
			{'done': true, 'title': 'tomato'},
			{'done': false, 'title': 'chicken'}],
}
logic.createItem(dummyProject1);
logic.createItem(dummyProject2);
logic.createItem(dummyProject3);

logic.createItem(dummyTask1);
logic.createItem(dummyTask2);
logic.createItem(dummyTask3);


logic.createItem(dummytest);
logic.createItem(dummytest1);

logic.createItem(dummyChecklist);
let checkList = data.storage.getObj(['title', dummyChecklist.title]);

// display all todos, and menus
let projectsBtn = document.getElementById('projects-btn');
let projectsMenu = document.getElementById(('projects-menu'));

let overviewBtn = document.getElementById('overview-btn');
let overviewMenu = document.getElementById(('overview-menu'));

let displayContent = document.getElementById('window-content');


projectsBtn.addEventListener('click', dom.unfoldMenu)
overviewBtn.addEventListener('click', dom.unfoldMenu)

dom.displayAllTodos(data.storage['objs'], displayContent);
dom.displayMenuComponents(data.storage.getObjs(['type', 'project']), projectsMenu);
dom.displayMenuComponents(data.storage.getObjs(['done', false]), overviewMenu);
console.log(data.storage['objs'], '<-storage[objs]');