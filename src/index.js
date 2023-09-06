import './styles/styles.css';

class Task {
	constructor(title, description, createdDay, dueDay, priority, project, status){
		this.title = title;
		this.createdDay = createdDay;
		this.dueDay = dueDay;
		this.priority = priority;
		this.project = project;
		this.description = description;
		this.status = status;
	}

	get properties(){
		return {
			this.title,
			this.createdDay,
			this.dueDay,
			this.priority,
			this.project,
			this.description,
		}
	}

}

class Checklist {
	constructor(title, project, items={}){
		this.title = title;
		this.project = project;
		this.items = items;
	}

	get properties(){
		return {
			this.title;
			this.project;
			this.items;
		}
	}
}

class Note {
	constructor(title, text, project){
		this.title = title;
		this.text = text;
		this.project = project;
	}

	get properties(){
		return {
			this.title;
			this.project;
			this.items;
		}
	}
}

class Project {
	constructor(title, text, tasks={}, notes={}){
		this.title;
		this.text;
		this.tasks;
		this.notes;
	}

	get properties(){
		return {
			this.title;
			this.text;
			this.tasks;
			this.notes;
		}
	}
}