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


let dummyTask1 = {
	title: 'dTask1',
	project: 'pro1',
	done: true,
	type: 'task',
}

let dummyTask2 = {
	title: 'dTask2',
	project: 'pro3',
	done: true,
	type: 'task',
}

let dummyTask3 = {
	title: 'dTask3',
	project: 'pro1',
	done: true,
	type: 'task',
}


let dummyChecklist = {
	title: 'weekly buying',
	project: 'pro2',
	done: true,
	type: 'checklist',
	previousProject: 'pro1',
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


logic.createItem(dummyChecklist);
let checkList = data.storage.getObj(['title', dummyChecklist.title]);
console.log(data.storage.objs, '<-storage[objs]', data.storage.getObjs(['type', true]));

// display all todos, and menus
let unassignedBtn = document.getElementById('unassigned-btn');
let completedBtn = document.getElementById('completed-btn');
let projectsBtn = document.getElementById('projects-btn');
let projectsMenu = document.getElementById('projects-menu');
let trashBtn = document.getElementById(('trash-btn'));
let overviewBtn = document.getElementById('overview-btn');
let overviewMenu = document.getElementById('overview-menu');

let displayWindow = document.getElementById('window-content');

unassignedBtn.addEventListener('click', dom.displayGroup);
completedBtn.addEventListener('click', dom.displayGroup);
projectsBtn.addEventListener('click', dom.unfoldMenu);
overviewBtn.addEventListener('click', dom.unfoldMenu);
trashBtn.addEventListener('click', dom.displayGroup);

dom.displayMenuComponents(data.storage.getObjs(['type', 'project']), projectsMenu);
dom.displayMenuComponents(data.storage.getObjs(['todo', true]), overviewMenu);
dom.displayAllTodos(data.storage.getObjs(['todo', true]), displayWindow);
console.log(data.storage.objs)
let testObj = data.storage.getObj(['title', 'pro1']);

// user preferences
let userPreferencesBtn = document.getElementById('userpreferences-btn');
userPreferencesBtn.addEventListener('click', dom.handleUserPref);
