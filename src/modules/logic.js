import * as data from './data.js';
export { Task, Checklist, Note, Project}

class Task {
	constructor(title='', project='', done=false, type='task'){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
	}
}

class Checklist {
	constructor(title, project, done=false, type='checklist', items={}){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = type;
		this.done = done;
		this.items = items;
	}
}

class Note {
	constructor(title, project, done=false, type='note', text){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.type = type;
		this.done = done;
		this.text = text;
	}
}

class Project {
	constructor(title, project='', done=false, type='project'){
		this.title = title.toLowerCase();
		this.project = project.toLowerCase();
		this.done = done;
		this.type = type;
	}
}