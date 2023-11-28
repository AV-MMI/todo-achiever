import './styles/styles.css';
import './styles/dom.css';

import * as crud from './modules/crud.js'
import * as repository from './modules/repository.js';
import * as dom from './modules/dom.js';
import * as utilities from './modules/utilities.js';

let project1 = new crud.Project('project1', '');
let project2 = new crud.Project('project2', '');
let sbproject1 = new crud.Project('sbproject1', 'project1');
let sbproject2 = new crud.Project('sbproject2', 'project2');

let task1 = new crud.Task('task1', 'sbproject1');
let task2 = new crud.Task('task2', 'sbproject2');

crud.createItem(project1, repository.getItems()	);
crud.createItem(project2, repository.getItems()	);
crud.createItem(sbproject1, repository.getItems()	);
crud.createItem(sbproject2, repository.getItems()	);
crud.createItem(task1, repository.getItems()	);
crud.createItem(task2, repository.getItems()	);

console.log(repository.getItems() ,'iteration 1')

let noteD = new crud.Note('Papel', ['The ambition for money loremsdasdasdasdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss'], 'project1');
crud.createItem(noteD);
noteD = repository.getItemFrom(['code', 'n6'], repository.getItems());

let paragraphArr = ["Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
"There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."]

let noteM = new crud.Note('A dictator on ruling the world.' , paragraphArr, 'project2', 'progress')

let nNote = dom.createRecItem(noteD);
let mNote = dom.createRecItem(noteM);

let aTask = new crud.Task('came out the block', 'project1', 'progress');
let aProject = new crud.Project('project-testing', '');

aTask = dom.createLineItem(aTask);
aProject = dom.createLineItem(aProject);

let clItems = [{done: false, title: 'Lettuce'}, {done: false, title: 'Tomato'}, {done: false, title: 'Onion'}]
let aChecklist = new crud.Checklist('Buy things', '', clItems);
aChecklist = dom.createRecItem(aChecklist);
let target = document.getElementById('display-cont');

console.log(aChecklist);
//target.appendChild(nNote);
target.appendChild(mNote);
target.appendChild(nNote);
target.appendChild(aTask);
target.appendChild(aProject);
target.appendChild(aChecklist);