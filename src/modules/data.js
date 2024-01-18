import * as logic from './logic.js'
export { storage, userSetting }

const storage = {
	objs: {title: 'objs',
			trash: {title: 'trash', type: 'dir'},
	},
	counter: 0,


	getObj([prop, value], level=this.objs){
		if(Object.keys(level).length > 0 && prop && value){
			if(prop == 'title' && value == ''){
				return this.objs;
			}
			// checking items at this level and look for a match
			for(let item in level){
				if(level[item][prop] ==  value){
					return level[item];
				}
			}

			// no match made at this level
			for(let item in level){
				if(level[item]['type'] == 'project' ){
					return this.getObj([prop, value], level[item]);
				}
			}

			// no match made at all levels
		} else {
			return false;
		}
	},


	getObjs([prop, value], level=this.objs, arr=[]){
		if(Object.keys(level).length > 0){
			// checking items at this level and look for a match
			for(let item in level){
				if(level[item][prop] ==  value){
					arr.push(level[item]);
				}
			}

			// no match made at this level
			for(let item in level){
				if(level[item]['type'] == 'project'){
					return this.getObjs([prop, value], level[item], arr);
				}
			}

			// no match made at all levels
			return arr;
		} else {
			return arr;
		}
	},


	uniqueAtLevel(obj){
		// get obj level
		let projectHost = this.getObj(['title', obj.project]);

		// loop through its elements to check if there is a title conflic
		for(let item in projectHost){
			if(projectHost[item]['title'] == obj.title){
				return false;
			}
		}

		return true;
	},

	addObj(obj={}){
		if(this.uniqueAtLevel(obj) && obj.type){
			// identify the obj with an unique id prop.
			if(!obj.id){
				obj.id = `${obj.type[0]}${this.counter}`;
				this.counter++;
			}

			// project == '': main || non-project: unassigned
			if(obj.project == ''){
				if(obj.type == 'project'){
					this.objs[obj.title] = obj;
				}
				else {
					this.objs[obj.id] = obj;
				}

			}

			// project == !'': sub || non-project: assigned
			else {
				// project exist
				if(this.getObj(['title', obj.project])){
					let projectHost = this.getObj(['title', obj.project]);
					if(obj.type == 'project'){
						projectHost[obj.title] = obj;
						return;
					}
					else {
						projectHost[obj.id] = obj;
						return;
					}
					return;
				}

				// project doesnot exist
				else {
					let projectHost = logic.createItem({'title': obj.project, 'project': '', 'done': false, 'type': 'project'});
					this.addObj(projectHost);
					this.addObj(obj);
				}
			}
		} else {
			return;
		}
	},

	removeObj(obj={}, storage=this.objs){
		// main project, or unassigned task.
		if(obj.project == ''){
			if(obj.type == 'project'){
				delete storage[obj.title];
			}
			else {
				delete storage[obj.id];
			}
		}
		// inside a project
		else {
			let projectHost = this.getObj(['title', obj.project]);
			console.log(projectHost, obj.project, 'projectHost')
			if(obj.type == 'project'){
				delete projectHost[obj.title];
			}
			else {
				delete projectHost[obj.id];
			}
		}
		return;
	},

	updateObj(obj={}, [prop, value]){
		//special cases: when a change in an obj's property requires re-add the obj
			// projects: title, project && non-projects: project
		if(obj.type == 'project' && prop == 'title' || obj.type == 'project' && prop == 'project' ||
			obj.type !== 'project' && prop == 'project'){
			let tempObj = Object.create(Object.getPrototypeOf(obj));
			Object.assign(tempObj, obj);
			tempObj[prop] = value;

			if(this.uniqueAtlevel(tempObj)){
				this.removeObj(obj);
				this.addObj(tempObj);
			}
		}

		//setting props || updating props
		else if(obj.todo && this.uniqueAtLevel(obj)){
			if(prop !== 'id' && prop !== 'type' && prop !== 'todo'){
				// main project, or unassigned task.
				if(obj.project == ''){
					if(obj.type == 'project'){
						storage[obj.title][prop] = value;
					}
					else {
						storage[obj.id][prop] = value;
					}
				}
				// inside a project
				else {
					let projectHost = this.getObj(['title', obj.project]) ? this.getObj(['title', obj.project]) : storage;

					if(obj.type == 'project'){
						projectHost[obj.title][prop] = value;
					}
					else {
						projectHost[obj.id][prop] = value;
					}

				}
				return;
			}
		}
	},

}

const userSetting = {
	remove: {
		partial: true,
		complete: false,
	},
	storage: {
		none: true,
		local: false,
	},

	toggleDeleteVals(){
		if(this.delete.partial){
			this.delete.complete = true;
			this.delete.partial = false;
		} else {
			this.delete.complete = false;
			this.delete.partial = true;
		}
	},

	useStorage( sto ){
		if(sto){
			for(let typeSto in this.storage){
				if(typeSto == sto){
					this.storage[typeSto] = true;
				} else {
					this.storage[typeSto] = false;
				}
			}
		}
	}
}