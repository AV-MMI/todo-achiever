import './styles/styles.css';
import './styles/dom.css';

import * as dom from './modules/dom.js';
import * as logic from './modules/logic.js'
import * as data from './modules/data.js';

let target = document.getElementById('display-cont');

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

let displayContent = document.getElementById('window-content')
dom.displayObj(checkList, displayContent);
data.storage.updateObj( data.storage.getObj(['id', 'p0']), ['daone', true] )
console.log(data.storage['objs'], '<-storage[objs]');
